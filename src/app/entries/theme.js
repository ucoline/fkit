function requireAll(r) {
    r.keys().forEach(r);
}

// Import all js files
requireAll(require.context('../scripts/', true, /\.js$/));