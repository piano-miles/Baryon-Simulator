const getProjectData = (function () {
    const storage = scaffolding.storage;
    storage.onprogress = (total, loaded) => {
        setProgress(interpolate(0.2, 0.98, loaded / total));
    };

    storage.addWebStore(
        [storage.AssetType.ImageVector, storage.AssetType.ImageBitmap, storage.AssetType.Sound],
        (asset) => new URL('./assets/' + asset.assetId + '.' + asset.dataFormat, location).href
    );
    return () => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.onerror = () => {
            if (location.protocol === 'file:') {
                reject(new Error('Zip environment must be used from a website, not from a file URL.'));
            } else {
                reject(new Error('Request to load project data failed.'));
            }
        };
        xhr.onprogress = (e) => {
            if (e.lengthComputable) {
                setProgress(interpolate(0.1, 0.2, e.loaded / e.total));
            }
        };
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', "./assets/project.json");
        xhr.send();
    });
})();