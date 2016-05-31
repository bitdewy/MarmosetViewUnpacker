// bitdewy@gmail.com

'use strict';

var exporter = {
    download: function (files) {
        var data = String.fromCharCode.apply(null, files['scene.json'].data);
        var title = JSON.parse(data).metaData.title;
        var zip = new JSZip();
        for (var file in files) {
            if (files.hasOwnProperty(file)) {
                zip.file(file, files[file].data, { binary: true });
            }
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, title + '.zip');
        });
    }
}
