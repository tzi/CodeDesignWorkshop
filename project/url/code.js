function Url(url) {
    if (!url) {
        url = window.location.href
    }
    return url;
}