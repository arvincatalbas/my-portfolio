<?php

namespace App\Commands;

use CodeIgniter\Commands\Server\Serve as BaseServe;

/**
 * Custom Serve command that safely handles Windows paths containing
 * special characters like '!' without breaking escapeshellarg.
 */
class Serve extends BaseServe
{
    /**
     * Builds the shell command passed to PHP's built-in webserver.
     */
    protected function buildServeCommand(string $php, string $host, int $port, string $docroot, string $rewrite): string
    {
        if (PHP_OS_FAMILY === 'Windows') {
            // escapeshellarg() on Windows replaces '!' and '%' with spaces.
            // When paths contain '!', use double quotes and strip trailing backslash
            // so cmd.exe doesn't escape the closing quote.
            return sprintf(
                '"%s" -S %s -t "%s" "%s"',
                $php,
                $host . ':' . $port,
                rtrim($docroot, '\\/'),
                $rewrite
            );
        }

        return parent::buildServeCommand($php, $host, $port, $docroot, $rewrite);
    }
}
