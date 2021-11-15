function requireAll(r) {
    r.keys().forEach(r);
}

// Import all html pages
requireAll(require.context('../', true, /\.html$/));