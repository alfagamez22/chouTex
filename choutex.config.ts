// choutex.config.ts
import type { ChouTeXConfig } from '@/types/choutex';

const config: ChouTeXConfig = {
    title: 'chouTex',
    tagline: 'A local-first LaTeX & Typst collaborative web editor',
    url: 'https://choutex.github.io',
    baseUrl: '/choutex/',
    organizationName: 'choutex',
    projectName: 'choutex',

    favicon: '/favicon.ico',

    pwa: {
        enabled: true,
        themeColor: '#ffffff',
        manifest: './manifest.json',
        startUrl: './',
        backgroundColor: '#ffffff',
        icons: [
            {
                src: './assets/images/chouTex_notext_192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        display: 'standalone',
        // All of these are OPTIONAL; if omitted, the script will fall back
        // to title & tagline.
        // name: 'chouTex',
        // shortName: 'chouTex',
        // description: 'A local-first LaTeX & Typst collaborative web editor',
    },

    plugins: {
        collaborative_viewers: ['bibtex', 'drawio'],
        viewers: ['bibtex', 'image', 'pdf', 'drawio'],
        renderers: ['pdf', 'canvas'],
        loggers: ['latex_visualizer', 'typst_visualizer'],
        bibliography: ['zotero', 'openalex'], // 'jabref' 
        lsp: [],
        backup: ['github', 'gitlab', 'forgejo', 'gitea'],
        themes: ['choutex_slim', 'choutex_wide', 'choutex_mobile'],
    },

    // overwrite priority is default < local < mobile for corresponding configs
    userdata: {
        version: '1.2.1',
        default: {
            settings: {
                bibtexViewerAutoTidy: false,
                bibtexViewerTidyOptions: 'standard',
                canvasRendererAnnotations: true,
                canvasRendererEnable: true,
                canvasRendererInitialZoom: '100',
                canvasRendererTextSelection: true,
                collabAutoReconnect: false,
                collabAwarenessTimeout: 30,
                collabProviderType: 'webrtc',
                collabSignalingServers: 'wss://ywebrtc.choutex.org',
                editorAutoSaveDelay: 1000,
                editorAutoSaveEnable: true,
                editorFontFamily: 'monospace',
                editorFontSize: 'lg',
                editorShowLineNumbers: true,
                editorSpellCheck: false,
                editorSyntaxHighlighting: true,
                editorThemeHighlights: 'auto',
                fileSyncAutoInterval: 10,
                fileSyncConflictResolution: 'prefer-latest',
                fileSyncEnable: true,
                fileSyncHoldTimeout: 30,
                fileSyncNotifications: true,
                fileSyncRequestTimeout: 60,
                fileSyncServerUrl: 'https://filepizza.choutex.org',
                fileSystemBackupAutoBackup: false,
                fileSystemBackupEnable: false,
                fileTreeFilesystemDragDrop: true,
                fileTreeInternalDragDrop: true,
                imageViewerAutoCenter: true,
                imageViewerEnableFilters: true,
                imageViewerEnablePanning: true,
                imageViewerQuality: 'high',
                latexEngine: 'pdftex',
                latexDefaultFormat: 'pdf',  // 'canvas-pdf'
                latexStoreCache: true,
                latexStoreWorkingDirectory: false,
                latexTexliveEndpoint: 'https://texlive.choutex.org',
                latexBusytexEndpoint: 'https://texlive2026.choutex.org',
                pdfRendererAnnotations: true,
                pdfRendererEnable: true,
                pdfRendererInitialZoom: '100',
                pdfRendererTextSelection: true,
                pdfViewerAutoScale: true,
                pdfViewerRenderingQuality: 'high',
                repositoryProxyUrl: 'https://proxy.choutex.org/?url=',
                latexSourcemapEnabled: true,
                templatesApiUrl: 'https://choutex.github.io/choutex-templates/api/templates.json',
                themePlugin: 'choutex-wide-theme',
                themeVariant: 'atom_light',
                typstAutoCompileOnOpen: false,
                typstDefaultFormat: 'canvas',
            },
            properties: {
                global: {
                    latexOutputCollapsed: true,
                    latexOutputWidth: 700,
                    logVisualizerHeight: 600,
                    logVisualizerCollapsed: false,
                    pdfRendererZoom: 1,
                    pdfRendererScrollView: true,
                    canvasRendererZoom: 1,
                    canvasRendererScrollView: true,
                    sidebarCollapsed: false,
                    sidebarWidth: 502,
                    sourcemapShowFloatingButtons: true,
                    toolbarVisible: true,
                },
            },
            secrets: {},
        },
        mobile: {
            settings: {
                themePlugin: 'choutex-mobile-theme',
                imageViewerEnablePanning: false,
                imageViewerAutoCenter: true,
            },
        },
        local: {
            settings: {
                collabSignalingServers: 'ws://localhost:4444/',
                fileSyncServerUrl: 'http://localhost:8080',
                latexBusytexEndpoint: 'http://localhost:8070',
                latexTexliveEndpoint: 'http://localhost:5004',
                themeVariant: 'dark',

            },
            properties: {
                global: {
                    pdfRendererScrollView: false,
                },
            },
        },
    },
};

export default config;
