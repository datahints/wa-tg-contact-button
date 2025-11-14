<?php
/**
 * Plugin Name: Jetstyle Contact Button
 * Description: Floating animated button linking to Telegram or WhatsApp with _ym_uid client id.
 * Version: 1.0.0
 * Author: Jetstyle
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jetstyle_Contact_Button
{
    private const VERSION = '1.0.0';

    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_footer', [$this, 'render_widget']);
    }

    public function enqueue_assets(): void
    {
        $plugin_url = plugin_dir_url(__FILE__);

        wp_enqueue_style(
            'jetstyle-contact-button',
            $plugin_url . 'assets/css/widget.css',
            [],
            self::VERSION
        );

        wp_enqueue_script(
            'jetstyle-contact-button',
            $plugin_url . 'assets/js/widget.js',
            [],
            self::VERSION,
            true
        );
    }

    public function render_widget(): void
    {
        echo '<div id="jetstyle-contact-button" class="jetstyle-contact-button" aria-live="polite" aria-label="Свяжитесь с нами"></div>';
    }
}

new Jetstyle_Contact_Button();

