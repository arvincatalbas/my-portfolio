<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class SendContactEmails extends BaseCommand
{
    /**
     * The Command's Group
     *
     * @var string
     */
    protected $group = 'Email';

    /**
     * The Command's Name
     *
     * @var string
     */
    protected $name = 'email:send-contact';

    /**
     * The Command's Description
     *
     * @var string
     */
    protected $description = 'Send queued portfolio contact emails.';

    /**
     * The Command's Usage
     *
     * @var string
     */
    protected $usage = 'command:name [arguments] [options]';

    /**
     * The Command's Arguments
     *
     * @var array
     */
    protected $arguments = [];

    /**
     * The Command's Options
     *
     * @var array
     */
    protected $options = [];

    /**
     * Actually execute a command.
     *
     * @param array $params
     */
    public function run(array $params)
    {
        $db = \Config\Database::connect();

        $smtpUser = trim((string) env('SMTP_USER'));
        $smtpPass = preg_replace(
            '/\s+/',
            '',
            trim((string) env('SMTP_PASS'))
        );

        if (
            !filter_var($smtpUser, FILTER_VALIDATE_EMAIL) ||
            strlen($smtpPass) !== 16
        ) {
            CLI::error('Invalid Gmail SMTP configuration.');
            return;
        }

        $jobs = $db->table('email_queue')
            ->where('status', 'pending')
            ->where('attempts <', 3)
            ->orderBy('id', 'ASC')
            ->limit(10)
            ->get()
            ->getResultArray();

        foreach ($jobs as $job) {
            // Claim this job before sending.
            $claimed = $db->table('email_queue')
                ->where('id', $job['id'])
                ->where('status', 'pending')
                ->update([
                    'status' => 'processing',
                    'attempts' => $job['attempts'] + 1,
                ]);

            if (!$claimed || $db->affectedRows() !== 1) {
                continue;
            }

            $email = service('email');

            $email->initialize([
                'protocol' => 'smtp',
                'SMTPHost' => 'smtp.gmail.com',
                'SMTPUser' => $smtpUser,
                'SMTPPass' => $smtpPass,
                'SMTPPort' => 587,
                'SMTPCrypto' => 'tls',
                'SMTPTimeout' => 15,
                'mailType' => 'text',
                'charset' => 'UTF-8',
                'wordWrap' => true,
                'validate' => true,
            ]);

            $email->setFrom($smtpUser, 'Arvin Catalbas');
            $email->setTo($job['recipient']);
            $email->setReplyTo($job['sender'], $job['name']);
            $email->setSubject($job['subject']);
            $email->setMessage($job['message']);

            if ($email->send()) {
                $db->table('email_queue')
                    ->where('id', $job['id'])
                    ->update([
                        'status' => 'sent',
                        'sent_at' => date('Y-m-d H:i:s'),
                    ]);

                CLI::write(
                    'Email sent: ' . $job['recipient'],
                    'green'
                );
            } else {
                $db->table('email_queue')
                    ->where('id', $job['id'])
                    ->update([
                        'status' => 'pending',
                    ]);

                log_message(
                    'error',
                    'Email queue job failed: ' . $job['id'] .
                    ' ' . $email->printDebugger(['headers'])
                );

                CLI::error('Email failed: ' . $job['id']);
            }
        }
    }
}
