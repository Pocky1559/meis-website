document.title = "MeIS | " + window.extensionName;

let link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}

link.href = '/images/favicon.svg';
