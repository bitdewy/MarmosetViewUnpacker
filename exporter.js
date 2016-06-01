// bitdewy@gmail.com

'use strict';

var first = true;

var exporter = {
    download: function (files) {

        var toHalfFloat = function (buffer) {
            var h = buffer[0] << 8 + buffer[1];
            var s = (h & 0x8000) >> 15;
            var e = (h & 0x7C00) >> 10;
            var f = h & 0x03FF;

            if (e == 0) {
                return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10));
            } else if (e == 0x1F) {
                return f ? NaN : ((s ? -1 : 1) * Infinity);
            }

            return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + (f / Math.pow(2, 10)));
        };

        var hm = function (hn) {
            var ho = (hn.y > (32767.1 / 65535.0));
            hn.y = ho ? (hn.y - (32768.0 / 65535.0)) : hn.y;
            var r = {};
            r.x = (2.0 * 65535.0 / 32767.0) * hn.x - 1.0;
            r.y = (2.0 * 65535.0 / 32767.0) * hn.y;
            r.z = Math.sqrt(Math.max(0.0, Math.min(1.0, 1.0 - r.x * r.x - r.y * r.y)));
            r.z = ho ? -r.z : r.z;
            return r;
        };

        var binary2VertexStruct = function (desc, data) {
            var parser = new BinaryParser;

            var index = [];
            var offset = 0;
            for (var i = 0; i < desc.indexCount; ++i) {
                var begin = offset + i * desc.indexTypeSize;
                var end = offset + (i + 1) * desc.indexTypeSize;
                var d = String.fromCharCode.apply(null, data.subarray(begin, end));
                index.push(parser.decodeInt(d, 8 * desc.indexTypeSize, true));
            };

            var wire = [];
            offset += desc.indexTypeSize * desc.indexCount;
            for (var i = 0; i < desc.wireCount; ++i) {
                var begin = offset + i * desc.indexTypeSize;
                var end = offset + (i + 1) * desc.indexTypeSize;
                var d = String.fromCharCode.apply(null, data.subarray(begin, end));
                wire.push(parser.decodeInt(d, 8 * desc.indexTypeSize, true));
            }

            var vetex = []
            offset += desc.wireCount * desc.indexTypeSize;
            var stride = 32;
            if (desc.vertexColor) {
                stride += 4;
            }
            if (desc.secondaryTexCoord) {
                stride += 8;
            }
            for (var i = 0; i < desc.vertexCount; ++i) {
                var begin = offset + i * stride;
                var end = offset + (i + 1) * stride;
                var buffer = data.subarray(begin, end);
                var v = {}
                var f = 0
                v.position = {
                    x: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 0, f + 4))),
                    y: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 4, f + 8))),
                    z: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 8, f + 12)))
                }
                f += 12
                v.texCoord = {
                    u: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 0, f + 4))),
                    v: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 4, f + 8)))
                }
                f += 8;

                if (desc.secondaryTexCoord) {
                    v.texCoord2 = {
                        u: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 0, f + 4))),
                        v: parser.toFloat(String.fromCharCode.apply(null, buffer.subarray(f + 4, f + 8)))
                    }
                    f += 8;
                }

                v.tangent = hm({
                    x: toHalfFloat(buffer.subarray(f + 0, f + 2)),
                    y: toHalfFloat(buffer.subarray(f + 2, f + 4))
                });
                f += 4;

                v.bitangent = hm({
                    x: toHalfFloat(buffer.subarray(f + 0, f + 2)),
                    y: toHalfFloat(buffer.subarray(f + 2, f + 4))
                });
                f += 4;

                v.normal = hm({
                    x: toHalfFloat(buffer.subarray(f + 0, f + 2)),
                    y: toHalfFloat(buffer.subarray(f + 2, f + 4))
                });
                f += 4;

                if (desc.vertexColor) {
                    v.color = {
                        r: buffer[f + 0],
                        g: buffer[f + 1],
                        b: buffer[f + 2],
                        a: buffer[f + 3]
                    };
                }
                vetex.push(v);
            }
            return {
                v: vetex,
                i: index
            };
        };

        var generateObj = function (mesh) {
            var content = '';
            var offset = 0;
            var position = '';
            var texCoord = '';
            var normal = '';
            mesh.v.forEach(function (v, i) {
                position = position.concat('v  ' + v.position.x.toFixed(4) + ' ' + v.position.y.toFixed(4) + ' ' + v.position.z.toFixed(4) + '\n');
                texCoord = texCoord.concat('vt ' + v.texCoord.u.toFixed(4) + ' ' + v.texCoord.v.toFixed(4) + '\n');
                normal = normal.concat('vn ' + v.normal.x.toFixed(4) + ' ' + v.normal.y.toFixed(4) + ' ' + v.normal.z.toFixed(4) + '\n');
            });
            var f = '\ng ' + mesh.name + '\n';
            var indices = mesh.i;
            for (var i = 0; i < indices.length / 3; ++i) {
                var i1 = indices[i * 3] + 1;
                var i2 = indices[i * 3 + 1] + 1;
                var i3 = indices[i * 3 + 2] + 1;
                f = f.concat('f  ' + i1 + ' ' + i2 + ' ' + i3 + '\n');
            }
            content = content.concat(position, texCoord, normal, f);
            return content;
        };

        var data = JSON.parse(String.fromCharCode.apply(null, files['scene.json'].data));
        var title = data.metaData.title;
        var zip = new JSZip();
        for (var file in files) {
            if (files.hasOwnProperty(file)) {
                var mesh = data.meshes.find(function (mesh) { return mesh.file == file; });
                if (mesh) {
                    var name = file.split('.')[0] + '.obj';
                    zip.file(name, generateObj(binary2VertexStruct(mesh, files[file].data)));
                } else {
                    zip.file(file, files[file].data, { binary: true });
                }
            }
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, title + '.zip');
        });
    }
}
