<?php
/**
 * Plugin Name: DataHints Contact Button
 * Description: Floating animated button linking to Telegram or WhatsApp with _ym_uid client id.
 * Version: 1.0.0
 * Author: DataHints
 */

if (!defined('ABSPATH')) {
    exit;
}

class Datahints_Contact_Button
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
            'datahints-contact-button',
            $plugin_url . 'assets/css/widget.css',
            [],
            self::VERSION
        );

        wp_enqueue_script(
            'datahints-contact-button',
            $plugin_url . 'assets/js/widget.js',
            [],
            self::VERSION,
            true
        );
    }

    public function render_widget(): void
    {
        echo '<div id="datahints-contact-button" class="datahints-contact-button" aria-live="polite" aria-label="Свяжитесь с нами"></div>';
    }
}

new Datahints_Contact_Button();

