<?php
namespace App\Core;

use App\Models\User;

class Auth
{
    /**
     * Login user
     * 
     * @param User $user
     * @return void
     */
    public static function login(User $user, $passowd, $remember = false): bool
    {
        if(!User::verifyPassword($passowd, $user->password)) return false;
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Handle remember token
        if ($remember) {
            $rememberToken = User::generateRememberToken();
            $user->setRememberToken($rememberToken);
            
            // Get expire minutes from .env or use default 1440 minutes (1 day)
            $expireMinutes = env('SESSION_LIFETIME', 1440);
            $expireTime = time() + ($expireMinutes * 60);
            
            // Set cookie with calculated expire time
            setcookie('remember_token', $rememberToken, $expireTime, '/', '', false, true);
        }

        $_SESSION['user_id'] = $user->id;
        return true;
    }

    /**
     * Logout user
     * 
     * @return void
     */
    public static function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Clear remember token from database if user exists
        if (isset($_SESSION['user_id'])) {
            $user = User::find($_SESSION['user_id']);
            if ($user) {
                $user->clearRememberToken();
            }
        }

        // Clear remember token cookie
        if (isset($_COOKIE['remember_token'])) {
            setcookie('remember_token', '', time() - 3600, '/', '', false, true);
        }

        unset($_SESSION['user_id']);
    }

    /**
     * Get current logged-in user
     * 
     * @return User|null
     */
    public static function user(): ?User
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Check session first
        if (isset($_SESSION['user_id'])) {
            $user = User::with('wallet')->find($_SESSION['user_id']); // โหลด wallet
            return $user;
        }

        // Check remember token if no session
        if (isset($_COOKIE['remember_token'])) {
            $user = User::findByRememberToken($_COOKIE['remember_token']);
            if ($user) {
                // Recreate session from remember token
                $_SESSION['user_id'] = $user->id;
                return $user;
            } else {
                // Invalid remember token, clear cookie
                setcookie('remember_token', '', time() - 3600, '/', '', false, true);
            }
        }

        return null;
    }

    public static function id(): string
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            return null;
        }

        return $_SESSION['user_id'];
    }

    /**
     * Check if user is logged in
     * 
     * @return bool
     */
    public static function check(): bool
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Check session first
        if (isset($_SESSION['user_id'])) {
            return true;
        }

        // Check remember token if no session
        if (isset($_COOKIE['remember_token'])) {
            $user = User::findByRememberToken($_COOKIE['remember_token']);
            if ($user) {
                // Recreate session from remember token
                $_SESSION['user_id'] = $user->id;
                return true;
            } else {
                // Invalid remember token, clear cookie
                setcookie('remember_token', '', time() - 3600, '/', '', false, true);
            }
        }

        return false;
    }
}
