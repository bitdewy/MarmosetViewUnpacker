/*
(Built: Mon, Sep 24, 2018  4:38:25 PM)
Marmoset Viewer Code and Tools

Copyright (c) 2018 Marmoset LLC.
All rights reserved.

Redistribution and use of this software are permitted provided
that the software remains whole and unmodified and this copyright
notice remains attached. Use or inclusion of any portion of this
code in other software programs is prohibited, excepting simple
embedding of this file in web applications. This software, or any
derivatives thereof, may not be resold, rented, leased, or
distributed on any other for-charge basis.

THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
*/
marmoset = {};
(function (marmoset) {
    'use strict';

    function AnimatedObject(a, b, c) {
        this.name = b.partName;
        this.animatedProperties = [];
        this.sceneObjectType = b.sceneObjectType;
        this.skinningRigIndex = b.skinningRigIndex;
        this.id = c;
        this.mesh = this.skinningRig = 0;
        this.materialIndex = this.lightIndex = this.meshIndex = -1;
        this.emissiveProperty = this.offsetVProperty = this.offsetUProperty = this.material = 0;
        this.debugMe = b.debugMe;
        this.debugString = "";
        this.hasTransform = !1;
        this.modelPartIndex = b.modelPartIndex;
        this.modelPartFPS = b.modelPartFPS;
        this.modelPartScale = b.modelPartScale;
        this.parentIndex = b.parentIndex;
        this.startTime = b.startTime;
        this.endTime = b.endTime;
        this.animationLength = this.endTime - this.startTime;
        this.totalFrames = b.totalFrames;
        this.turnTableSpinOffset = this.turnTableSpin = this.spinProperty = this.dispersionProperty = this.lightIllumProperty = this.skyIllumProperty = this.opacityProperty = this.spotSharpnessProperty = this.spotAngleProperty = this.distanceProperty = this.brightnessProperty = this.blueProperty = this.greenProperty = this.redProperty = this.visibleProperty = 0;
        if (b.animatedProperties) {
            c =
                b.animatedProperties.length;
            for (var d = 0; d < c; ++d) {
                var e = b.animatedProperties[d],
                    f = new AnimatedProperty;
                f.name = e.name;
                this.animatedProperties.push(f);
                "Red" != f.name || this.redProperty || (this.redProperty = f);
                "Green" != f.name || this.greenProperty || (this.greenProperty = f);
                "Blue" != f.name || this.blueProperty || (this.blueProperty = f);
                "Brightness" != f.name || this.brightnessProperty || (this.brightnessProperty = f);
                "Distance" != f.name || this.distanceProperty || (this.distanceProperty = f);
                "Spot Angle" != f.name || this.spotAngleProperty ||
                    (this.spotAngleProperty = f);
                "Spot Sharpness" != f.name || this.spotSharpnessProperty || (this.spotSharpnessProperty = f);
                "Opacity" != f.name || this.opacityProperty || (this.opacityProperty = f);
                "Sky Illumination" != f.name || this.skyIllumProperty || (this.skyIllumProperty = f);
                "Light Illumination" != f.name || this.lightIllumProperty || (this.lightIllumProperty = f);
                "Dispersion" != f.name || this.dispersionProperty || (this.dispersionProperty = f);
                "Visible" != f.name || this.visibleProperty || (this.visibleProperty = f);
                "Spin Rate" == f.name && (this.spinProperty =
                    f);
                "OffsetU" == f.name && (this.offsetUProperty = f);
                "OffsetV" == f.name && (this.offsetVProperty = f);
                "EmissiveIntensity" == f.name && (this.emissiveProperty = f)
            }
        }
        this.keyframesSharedBufferUShorts = this.keyframesSharedBufferFloats = this.keyFramesByteStream = 0;
        if (a = a.get(b.file)) this.keyFramesByteStream = new ByteStream(a.data), this.unPackKeyFrames();
        this.animatedLocalTransform = new AnimatedTransform(this);
        this.hasTransform = this.animatedLocalTransform.hasTranslation || this.animatedLocalTransform.hasRotation || this.animatedLocalTransform.hasScale;
        this.cachedWorldTransform0 = Matrix.identity();
        this.cachedWorldTransform1 = Matrix.identity();
        this.cachedWorldTransform2 = Matrix.identity();
        this.cachedWorldTransform3 = Matrix.identity();
        this.cachedFrame3 = this.cachedFrame2 = this.cachedFrame1 = this.cachedFrame0 = -10;
        this.cachedFrameUse3 = this.cachedFrameUse2 = this.cachedFrameUse1 = this.cachedFrameUse0 = 0;
        this.useFixedLocalTransform = this.useFixedWorldTransform = !1
    }
    AnimatedObject.prototype.setFixedWorldTransform = function (a) {
        this.useFixedWorldTransform = !0;
        Matrix.copy(this.cachedWorldTransform0, a)
    };
    AnimatedObject.prototype.setFixedLocalTransform = function (a) {
        this.useFixedLocalTransform = !0;
        this.animatedLocalTransform.lockTransform = !0;
        Matrix.copy(this.animatedLocalTransform.cachedmatrix0, a)
    };
    AnimatedObject.prototype.getCachedWorldTransform = function (a) {
        return this.useFixedWorldTransform ? 0 : a == this.cachedFrame0 ? this.cachedmatrix0 : a == this.cachedFrame1 ? this.cachedmatrix1 : a == this.cachedFrame2 ? this.cachedmatrix2 : a == this.cachedFrame3 ? this.cachedmatrix3 : 0
    };
    AnimatedObject.prototype.getFreeCachedWorldTransform = function (a) {
        if (this.useFixedWorldTransform) return 0;
        this.cachedFrameUse0--;
        this.cachedFrameUse1--;
        this.cachedFrameUse2--;
        this.cachedFrameUse3--;
        if (this.cachedFrameUse0 <= this.cachedFrameUse1 && this.cachedFrameUse0 <= this.cachedFrameUse2 && this.cachedFrameUse0 <= this.cachedFrameUse3) return this.cachedFrame0 = a, this.cachedFrameUse0 = 0, this.cachedWorldTransform0;
        if (this.cachedFrameUse1 <= this.cachedFrameUse0 && this.cachedFrameUse1 <= this.cachedFrameUse2 && this.cachedFrameUse1 <=
            this.cachedFrameUse3) return this.cachedFrame1 = a, this.cachedFrameUse1 = 0, this.cachedWorldTransform1;
        if (this.cachedFrameUse2 <= this.cachedFrameUse0 && this.cachedFrameUse2 <= this.cachedFrameUse1 && this.cachedFrameUse2 <= this.cachedFrameUse3) return this.cachedFrame2 = a, this.cachedFrameUse2 = 0, this.cachedWorldTransform2;
        this.cachedFrame3 = a;
        this.cachedFrameUse3 = 0;
        return this.cachedWorldTransform3
    };
    AnimatedObject.prototype.unPackKeyFrames = function () {
        if (this.keyFramesByteStream) {
            var a = new Float32Array(this.keyFramesByteStream.bytes.buffer),
                b = new Uint32Array(this.keyFramesByteStream.bytes.buffer),
                c = new Uint16Array(this.keyFramesByteStream.bytes.buffer),
                d = new Uint8Array(this.keyFramesByteStream.bytes.buffer);
            this.keyframesSharedBufferFloats = a;
            this.keyframesSharedBufferUShorts = b;
            for (var a = 0, b = b[0], a = 1 + b, b = this.animatedProperties.length, e = 0; e < b; e++) {
                var f = this.animatedProperties[e],
                    g = 2 + 2 * e,
                    h = 2 * g;
                f.keyframeBufferStartIndexFloat = a;
                f.numKeyframes = c[g];
                f.keyframePackingType = d[h + 2];
                f.interpolationType = d[h + 3];
                f.indexFloatSkip = 0;
                f.indexUShortSkip = 0;
                0 < f.numKeyframes && (0 == f.keyframePackingType ? (f.bytesPerKeyFrame = 16, f.indexFloatSkip = 4, f.indexUShortSkip = 8, f.valueOffsetFloat = 0, f.weighInOffsetFloat = 1, f.weighOutOffsetFloat = 2, f.frameIndexOffsetUShort = 6, f.interpolationOffsetUShort = 7) : 1 == f.keyframePackingType ? (f.bytesPerKeyFrame = 8, f.indexFloatSkip = 2, f.indexUShortSkip = 4, f.valueOffsetFloat = 0, f.weighInOffsetFloat =
                    0, f.weighOutOffsetFloat = 0, f.frameIndexOffsetUShort = 2, f.interpolationOffsetUShort = 3) : 2 == f.keyframePackingType && (f.bytesPerKeyFrame = 4, f.indexFloatSkip = 1, f.indexUShortSkip = 2, f.valueOffsetFloat = 0, f.weighInOffsetFloat = 0, f.weighOutOffsetFloat = 0, f.frameIndexOffsetUShort = 0, f.interpolationOffsetUShort = 0));
                a += f.numKeyframes * f.indexFloatSkip
            }
        }
    };
    AnimatedObject.prototype.setupSkinningRig = function (a, b, c, d) {
        var e = Matrix.identity(),
            f = Matrix.identity(),
            g = a.animatedObjects[b],
            h = c * g.modelPartFPS,
            h = h - Math.floor(h);
        c = Math.floor(a.getObjectAnimationFramePercent(g, c));
        var g = c + 1,
            k = 1 - h,
            l = d.skinningClusters.length;
        if (0 < l)
            for (var n = 0; n < l; n++) {
                var m = d.skinningClusters[n];
                m.solveClusterTransformAtFrame(a, b, c, e);
                m.solveClusterTransformAtFrame(a, b, g, f);
                for (var m = m.matrix, p = 0; 16 > p; p++) m[p] = e[p] * k + f[p] * h
            }
    };
    AnimatedObject.prototype.evaluateLocalTransformAtFramePercent = function (a, b, c, d) {
        if (this.useFixedLocalTransform) Matrix.copy(b, this.animatedLocalTransform.cachedmatrix0);
        else {
            var e = 0;
            d && (e = this.animatedLocalTransform.getCachedTransform(a));
            e ? Matrix.copy(b, e) : ((e = this.animatedLocalTransform.getFreeCachedTransform(a)) ? (this.animatedLocalTransform.evaluateMatrix(e, this.totalFrames, a, c), Matrix.copy(b, e)) : this.animatedLocalTransform.evaluateMatrix(b, this.totalFrames, a, c), 0 != this.turnTableSpin && (a = Matrix.rotation(Matrix.empty(),
                this.turnTableSpin, 1), Matrix.mul(b, b, a)))
        }
    };
    AnimatedObject.prototype.hasAnimatedTransform = function () {
        var a = this.animatedLocalTransform;
        return a.TX && 1 < a.TX.numKeyframes || a.TY && 1 < a.TY.numKeyframes || a.TZ && 1 < a.TZ.numKeyframes || a.RX && 1 < a.RX.numKeyframes || a.RY && 1 < a.RY.numKeyframes || a.RZ && 1 < a.RZ.numKeyframes || a.SX && 1 < a.SX.numKeyframes || a.SY && 1 < a.SY.numKeyframes || a.SZ && 1 < a.SZ.numKeyframes ? !0 : !1
    };

    function AnimatedProperty() {
        this.currentValue = 0;
        this.keyframeBufferStartIndexFloat = -1;
        this.lastValue = this.interpolationOffsetUShort = this.frameIndexOffsetUShort = this.weighOutOffsetFloat = this.weighInOffsetFloat = this.valueOffsetFloat = this.indexUShortSkip = this.indexFloatSkip = this.interpolationType = this.bytesPerKeyFrame = this.keyframePackingType = 0;
        this.lastFramePercent = -10;
        this.enable = !0;
        this.name = "NONE";
        this.splineKF0 = new KeyFrame(0, 0);
        this.splineKF1 = new KeyFrame(0, 0);
        this.splineKF2 = new KeyFrame(0, 0);
        this.splineKF3 = new KeyFrame(0, 0);
        this.debugMe = !0;
        this.debugString = "";
        this.lastSearchIndex = 1;
        this.savedSearchIndex = 0;
        this.splineKF0.frameIndex = 0;
        this.splineKF1.frameIndex = 1;
        this.splineKF2.frameIndex = 2;
        this.splineKF3.frameIndex = 3;
        this.numKeyframes = 0
    }
    AnimatedProperty.prototype.evaluateCurve = function (a, b) {
        var c = this.splineKF1.frameIndex,
            d = this.splineKF2.frameIndex,
            e = this.splineKF1.value,
            f = this.splineKF2.value,
            g = c - (this.splineKF2.frameIndex - this.splineKF0.frameIndex),
            h = d - (this.splineKF1.frameIndex - this.splineKF3.frameIndex),
            k = e - (this.splineKF2.value - this.splineKF0.value) * this.splineKF1.weighOut,
            l = f - (this.splineKF1.value - this.splineKF3.value) * this.splineKF2.weighIn;
        3 == this.splineKF1.interpolation && (g = c - (this.splineKF2.frameIndex - this.splineKF1.frameIndex),
            k = e - this.splineKF1.weighOut);
        3 == this.splineKF2.interpolation && (h = d - (this.splineKF1.frameIndex - this.splineKF2.frameIndex), l = f + this.splineKF2.weighIn);
        g = (a - g) / (c - g);
        c = (a - c) / (d - c);
        d = (a - d) / (h - d);
        h = e * (1 - c) + f * c;
        return ((k * (1 - g) + e * g) * (1 - c) + h * c) * (1 - c) + ((f * (1 - d) + l * d) * c + h * (1 - c)) * c
    };
    AnimatedProperty.prototype.evaluate = function (a, b, c) {
        if (!c) return b;
        if (0 == this.numKeyframes) return this.lastValue = b;
        if (1 == this.numKeyframes) return this.lastValue = 2 == this.keyframePackingType ? c.keyframesSharedBufferFloats[this.keyframeBufferStartIndexFloat] : c.keyframesSharedBufferFloats[this.keyframeBufferStartIndexFloat + this.valueOffsetFloat];
        if (this.lastFramePercent == a) return this.lastValue;
        var d = this.keyframeBufferStartIndexFloat,
            e = 2 * this.keyframeBufferStartIndexFloat;
        this.lastValue = b;
        this.lastFramePercent =
            a;
        if (2 == this.keyframePackingType) {
            b = Math.floor(a);
            var f = a - b;
            a >= this.numKeyframes && (b -= Math.floor(a / this.numKeyframes) * this.numKeyframes);
            if (b >= this.numKeyframes - 1) return this.lastValue = c.keyframesSharedBufferFloats[d + (this.numKeyframes - 1)];
            if (0 > b) return this.lastValue = c.keyframesSharedBufferFloats[d];
            if (0 == f) return this.lastValue = c.keyframesSharedBufferFloats[d + b];
            a = e = c.keyframesSharedBufferFloats[d + b];
            b++;
            b >= this.numKeyframes && (b -= this.numKeyframes);
            0 <= b && b < this.numKeyframes ? a = e * (1 - f) + c.keyframesSharedBufferFloats[d +
                b] * f : c.debugString += "<br>bad lerp frame " + b + " of " + this.numKeyframes;
            return this.lastValue = a
        }
        var g = this.numKeyframes,
            f = c.keyframesSharedBufferUShorts[e + this.frameIndexOffsetUShort];
        if (a >= c.keyframesSharedBufferUShorts[e + (g - 1) * this.indexUShortSkip + this.frameIndexOffsetUShort]) return this.lastValue = c.keyframesSharedBufferFloats[d + (g - 1) * this.indexFloatSkip + this.valueOffsetFloat];
        if (a < f) return this.lastValue = c.keyframesSharedBufferFloats[d + this.valueOffsetFloat];
        this.lastSearchIndex < this.numKeyframes &&
            a > c.keyframesSharedBufferUShorts[e + this.lastSearchIndex * this.indexUShortSkip + this.frameIndexOffsetUShort] && (this.lastSearchIndex = 1);
        for (var h = this.lastSearchIndex; h < g; h++) {
            var f = d + h * this.indexFloatSkip,
                k = d + (h - 1) * this.indexFloatSkip,
                l = e + h * this.indexUShortSkip,
                n = e + (h - 1) * this.indexUShortSkip;
            if (a >= c.keyframesSharedBufferUShorts[n + this.frameIndexOffsetUShort] && a <= c.keyframesSharedBufferUShorts[l + this.frameIndexOffsetUShort]) {
                this.lastSearchIndex = h;
                var m = c.keyframesSharedBufferUShorts[n + this.interpolationOffsetUShort];
                if (2 == m) {
                    this.lastValue = a = a >= c.keyframesSharedBufferUShorts[l + this.frameIndexOffsetUShort] ? c.keyframesSharedBufferFloats[f + this.valueOffsetFloat] : c.keyframesSharedBufferFloats[k + this.valueOffsetFloat];
                    break
                }
                if (0 == m) {
                    d = c.keyframesSharedBufferUShorts[n + this.frameIndexOffsetUShort];
                    b = c.keyframesSharedBufferFloats[k + this.valueOffsetFloat];
                    e = c.keyframesSharedBufferFloats[f + this.valueOffsetFloat];
                    f = (a - d) / (c.keyframesSharedBufferUShorts[l + this.frameIndexOffsetUShort] - d);
                    this.lastValue = a = b * (1 - f) + e * f;
                    break
                }
                if (1 ==
                    m || 3 == m) {
                    var p = m = !1,
                        r = 0,
                        s = c.keyframesSharedBufferFloats[k + this.valueOffsetFloat],
                        u = c.keyframesSharedBufferFloats[f + this.valueOffsetFloat],
                        q = 0,
                        x = 0,
                        n = c.keyframesSharedBufferUShorts[n + this.frameIndexOffsetUShort],
                        l = c.keyframesSharedBufferUShorts[l + this.frameIndexOffsetUShort],
                        w = 0,
                        v = 1,
                        t = 1,
                        y = 1,
                        E = 1,
                        F = 1,
                        A = 1,
                        B = 1,
                        z = 1;
                    0 != this.weighInOffsetFloat && (t = c.keyframesSharedBufferFloats[k + this.weighInOffsetFloat], y = c.keyframesSharedBufferFloats[f + this.weighInOffsetFloat], A = c.keyframesSharedBufferFloats[k + this.weighOutOffsetFloat],
                        B = c.keyframesSharedBufferFloats[f + this.weighOutOffsetFloat]);
                    1 < h && (m = !0, r = c.keyframesSharedBufferFloats[d + (h - 2) * this.indexFloatSkip + this.valueOffsetFloat], x = c.keyframesSharedBufferUShorts[e + (h - 2) * this.indexUShortSkip + this.frameIndexOffsetUShort], 0 != this.weighInOffsetFloat && (v = c.keyframesSharedBufferFloats[d + (h - 2) * this.indexFloatSkip + this.weighInOffsetFloat], F = c.keyframesSharedBufferFloats[d + (h - 2) * this.indexFloatSkip + this.weighOutOffsetFloat]));
                    h < g - 1 && (p = !0, q = c.keyframesSharedBufferFloats[d + (h + 1) *
                        this.indexFloatSkip + this.valueOffsetFloat], w = c.keyframesSharedBufferUShorts[e + (h + 1) * this.indexUShortSkip + this.frameIndexOffsetUShort], 0 != this.weighInOffsetFloat && (E = c.keyframesSharedBufferFloats[d + (h + 1) * this.indexFloatSkip + this.weighInOffsetFloat], z = c.keyframesSharedBufferFloats[d + (h + 1) * this.indexFloatSkip + this.weighOutOffsetFloat]));
                    m && p ? (this.splineKF0.value = r, this.splineKF1.value = s, this.splineKF2.value = u, this.splineKF3.value = q, this.splineKF0.frameIndex = x, this.splineKF1.frameIndex = n, this.splineKF2.frameIndex =
                        l, this.splineKF3.frameIndex = w, this.splineKF0.weighIn = v, this.splineKF0.weighOut = F, this.splineKF1.weighIn = t, this.splineKF1.weighOut = A, this.splineKF2.weighIn = y, this.splineKF2.weighOut = B, this.splineKF3.weighIn = E, this.splineKF3.weighOut = z) : (this.splineKF0.value = s, this.splineKF1.value = s, this.splineKF2.value = u, this.splineKF3.value = u, this.splineKF0.frameIndex = n, this.splineKF1.frameIndex = n, this.splineKF2.frameIndex = l, this.splineKF3.frameIndex = l, this.splineKF1.weighIn = t, this.splineKF2.weighIn = y, this.splineKF1.weighOut =
                        A, this.splineKF2.weighOut = B, p ? (this.splineKF3.value = q, this.splineKF3.frameIndex = w, this.splineKF3.weighIn = E, this.splineKF3.weighOut = z) : (this.splineKF3.frameIndex++, this.splineKF3.value = this.splineKF1.value, this.splineKF3.weighIn = 1, this.splineKF3.weighOut = 1), m ? (this.splineKF0.value = r, this.splineKF0.frameIndex = x, this.splineKF0.weighIn = v, this.splineKF0.weighOut = F) : (this.splineKF0.value = this.splineKF2.value, this.splineKF0.weighIn = 1, this.splineKF0.weighOut = 1, 0 < this.splineKF0.frameIndex ? this.splineKF0.frameIndex-- :
                            (this.splineKF1.frameIndex++, this.splineKF2.frameIndex++, this.splineKF3.frameIndex++, a++)));
                    this.lastValue = a = this.evaluateCurve(a, b);
                    break
                }
            }
        }
        return this.lastValue
    };

    function AnimatedTransform(a) {
        var b = a.animatedProperties;
        this.TX = this.TY = this.TZ = this.RX = this.RY = this.RZ = this.SX = this.SY = this.SZ = 0;
        this.hostObject = a;
        this.matrix = Matrix.identity();
        this.cachedmatrix0 = Matrix.identity();
        this.cachedmatrix1 = Matrix.identity();
        this.cachedmatrix2 = Matrix.identity();
        this.cachedmatrix3 = Matrix.identity();
        this.cachedFrame3 = this.cachedFrame2 = this.cachedFrame1 = this.cachedFrame0 = -1;
        this.cachedFrameUse3 = this.cachedFrameUse2 = this.cachedFrameUse1 = this.cachedFrameUse0 = 0;
        this.debugString =
            "";
        for (a = 0; a < b.length; a++) {
            var c = b[a];
            "Translation X" == c.name ? this.TX = c : "Translation Y" == c.name ? this.TY = c : "Translation Z" == c.name ? this.TZ = c : "Rotation X" == c.name ? this.RX = c : "Rotation Y" == c.name ? this.RY = c : "Rotation Z" == c.name ? this.RZ = c : "Scale X" == c.name ? this.SX = c : "Scale Y" == c.name ? this.SY = c : "Scale Z" == c.name && (this.SZ = c)
        }
        this.hasTranslation = this.TX && this.TY && this.TZ;
        this.hasRotation = this.RX && this.RY && this.RZ;
        this.hasScale = this.SX && this.SY && this.SZ;
        this.lockTransform = !1
    }
    AnimatedTransform.prototype.getTRSValue = function (a, b, c) {
        if (!b) return c;
        b.evaluate(a, c, this.hostObject);
        "" != b.debugString && (this.debugString += b.debugString);
        return b.lastValue
    };
    AnimatedTransform.prototype.evaluateMatrix = function (a, b, c, d) {
        if (this.lockTransform) Matrix.copy(a, this.cachedmatrix0);
        else {
            var e = 0,
                f = b = 0,
                e = f = b = 0,
                e = f = b = 1;
            this.hasRotation ? (e = this.getTRSValue(c, this.RX, 0), b = this.getTRSValue(c, this.RY, 0), f = this.getTRSValue(c, this.RZ, 0), d ? (this.matrix = Matrix.rotation(Matrix.empty(), f, 2), d = Matrix.rotation(Matrix.empty(), e, 0), Matrix.mul(d, d, this.matrix), this.matrix = Matrix.rotation(Matrix.empty(), b, 1)) : (this.matrix = Matrix.rotation(Matrix.empty(), e, 0), d = Matrix.rotation(Matrix.empty(),
                b, 1), Matrix.mul(d, d, this.matrix), this.matrix = Matrix.rotation(Matrix.empty(), f, 2)), Matrix.mul(this.matrix, this.matrix, d)) : Matrix.copy(this.matrix, Matrix.identity());
            this.hasTranslation && (b = this.getTRSValue(c, this.TX, 0), f = this.getTRSValue(c, this.TY, 0), e = this.getTRSValue(c, this.TZ, 0), this.matrix[12] = b, this.matrix[13] = f, this.matrix[14] = e);
            this.hasScale && (b = this.getTRSValue(c, this.SX, 1), f = this.getTRSValue(c, this.SY, 1), e = this.getTRSValue(c, this.SZ, 1), this.matrix[0] *= b, this.matrix[4] *= f, this.matrix[8] *=
                e, this.matrix[1] *= b, this.matrix[5] *= f, this.matrix[9] *= e, this.matrix[2] *= b, this.matrix[6] *= f, this.matrix[10] *= e, this.matrix[3] *= b, this.matrix[7] *= f, this.matrix[11] *= e);
            Matrix.copy(a, this.matrix)
        }
    };
    AnimatedTransform.prototype.clearCachedTransforms = function () {
        this.cachedFrame3 = this.cachedFrame2 = this.cachedFrame1 = this.cachedFrame0 = -1;
        this.cachedFrameUse3 = this.cachedFrameUse2 = this.cachedFrameUse1 = this.cachedFrameUse0 = 0;
        this.TX && (this.TX.lastFramePercent = -10);
        this.TY && (this.TY.lastFramePercent = -10);
        this.TZ && (this.TZ.lastFramePercent = -10);
        this.RX && (this.RX.lastFramePercent = -10);
        this.RY && (this.RY.lastFramePercent = -10);
        this.RZ && (this.RZ.lastFramePercent = -10);
        this.SX && (this.SX.lastFramePercent = -10);
        this.SY && (this.SY.lastFramePercent = -10);
        this.SZ && (this.SZ.lastFramePercent = -10);
        this.lockTransform = !1
    };
    AnimatedTransform.prototype.getCachedTransform = function (a) {
        return this.lockTransform ? 0 : this.cachedFrame0 == a ? this.cachedmatrix0 : this.cachedFrame1 == a ? this.cachedmatrix1 : this.cachedFrame2 == a ? this.cachedmatrix2 : this.cachedFrame3 == a ? this.cachedmatrix3 : 0
    };
    AnimatedTransform.prototype.getFreeCachedTransform = function (a) {
        if (this.lockTransform) return 0;
        this.cachedFrameUse0--;
        this.cachedFrameUse1--;
        this.cachedFrameUse2--;
        this.cachedFrameUse3--;
        if (this.cachedFrameUse0 <= this.cachedFrameUse1 && this.cachedFrameUse0 <= this.cachedFrameUse2 && this.cachedFrameUse0 <= this.cachedFrameUse3 || this.cachedFrame0 == a) return this.cachedFrame0 = a, this.cachedFrameUse0 = 0, this.cachedmatrix0;
        if (this.cachedFrameUse1 <= this.cachedFrameUse0 && this.cachedFrameUse1 <= this.cachedFrameUse2 &&
            this.cachedFrameUse1 <= this.cachedFrameUse3 || this.cachedFrame1 == a) return this.cachedFrame1 = a, this.cachedFrameUse1 = 0, this.cachedmatrix1;
        if (this.cachedFrameUse2 <= this.cachedFrameUse0 && this.cachedFrameUse2 <= this.cachedFrameUse1 && this.cachedFrameUse2 <= this.cachedFrameUse3 || this.cachedFrame2 == a) return this.cachedFrame2 = a, this.cachedFrameUse2 = 0, this.cachedmatrix2;
        this.cachedFrame3 = a;
        this.cachedFrameUse3 = 0;
        return this.cachedmatrix3
    };

    function Animation(a, b) {
        this.originalFPS = 1;
        this.name = b.name;
        this.totalSeconds = b.length;
        this.originalFPS = b.originalFPS;
        this.totalFrames = b.totalFrames;
        this.expectedNumAnimatedObjects = b.numAnimatedObjects;
        this.animatedObjects = [];
        this.sceneTransform = Matrix.identity();
        this.debugString = "";
        if (b.animatedObjects)
            for (var c = b.animatedObjects.length, d = 0; d < c; ++d) {
                var e = new AnimatedObject(a, b.animatedObjects[d], d);
                this.animatedObjects.push(e);
                this.debugString += e.debugString
            }
        this.meshObjects = [];
        this.lightObjects = [];
        this.materialObjects = [];
        this.turnTableObjects = [];
        this.cameraObjects = []
    }
    Animation.prototype.evaluateModelPartTransformAtFrame = function (a, b, c, d) {
        Matrix.copy(c, Matrix.identity());
        for (var e = 0; 100 > e; e++) {
            var f = this.animatedObjects[a];
            if (a == f.parentIndex) break;
            if (f.useFixedWorldTransform) {
                Matrix.mul(c, f.cachedWorldTransform0, c);
                break
            } else {
                var g = 0;
                d && (g = f.getCachedWorldTransform(b));
                if (g) {
                    Matrix.mul(c, g, c);
                    break
                } else g = Matrix.identity(), f.evaluateLocalTransformAtFramePercent(b, g, !1, d), Matrix.mul(c, g, c), a == f.parentIndex && (e = 100), a = f.parentIndex
            }
        }
    };
    Animation.prototype.lerpModelPartTransform = function (a, b, c, d) {
        var e = this.animatedObjects[a];
        if (e.useFixedWorldTransform) Matrix.copy(c, e.cachedWorldTransform0);
        else {
            var f = b * e.modelPartFPS,
                f = f - Math.floor(f),
                g = Math.floor(this.getObjectAnimationFramePercent(e, b)),
                h = g + 1,
                k = b = 0;
            d && (b = e.getCachedWorldTransform(g), k = e.getCachedWorldTransform(h));
            b || ((b = e.getFreeCachedWorldTransform(g)) || (b = Matrix.identity()), this.evaluateModelPartTransformAtFrame(a, g, b, d));
            k || ((k = e.getFreeCachedWorldTransform(h)) || (k = Matrix.identity()),
                this.evaluateModelPartTransformAtFrame(a, h, k, d));
            a = 1 - f;
            for (d = 0; 16 > d; d++) c[d] = b[d] * a + k[d] * f
        }
    };
    Animation.prototype.getModelPartTransform = function (a, b, c, d) {
        this.lerpModelPartTransform(a, b, c, d)
    };
    Animation.prototype.getAnimatedLocalTransform = function (a, b, c, d) {
        a = this.animatedObjects[a];
        var e = this.animatedObjects[a.parentIndex],
            f = e.modelPartIndex != e.id,
            g = Matrix.identity();
        this.getModelPartTransform(a.modelPartIndex, b, g, d);
        if (f) {
            var f = Matrix.identity(),
                h = Matrix.identity();
            this.getModelPartTransform(e.modelPartIndex, b, f, d);
            Matrix.invert(h, f);
            Matrix.mul(c, h, g);
            c[12] *= a.modelPartScale;
            c[13] *= a.modelPartScale;
            c[14] *= a.modelPartScale
        } else Matrix.copy(c, g)
    };
    Animation.prototype.isVisibleAtFramePercent = function (a, b) {
        for (var c = a, d = 0, e = 0; 100 > e; e++) {
            d = this.animatedObjects[c];
            if (d.visibleProperty) {
                d.visibleProperty.evaluate(b, 1, d);
                if ("" != d.debugString || "" != d.visibleProperty.debugString) return this.debugString += d.debugString, this.debugString += d.visibleProperty.debugString, !1;
                if (0 == d.visibleProperty.lastValue) return !1
            }
            c == d.parentIndex && (e = 100);
            c = d.parentIndex
        }
        return !0
    };
    Animation.prototype.getWorldTransform = function (a, b, c, d, e) {
        a = this.animatedObjects[a];
        if (a.useFixedWorldTransform) Matrix.copy(c, a.cachedWorldTransform0);
        else {
            var f = this.getObjectAnimationFramePercent(a, b),
                g = Matrix.identity();
            a.evaluateLocalTransformAtFramePercent(f, g, !0, e);
            if (f = a.modelPartIndex != a.id) {
                var f = Matrix.identity(),
                    h = Matrix.identity();
                Matrix.copy(h, g);
                this.getAnimatedLocalTransform(a.id, b, f);
                Matrix.mul(g, f, h)
            }
            Matrix.copy(c, g);
            if (a.parentIndex != a.id)
                for (var k = a.parentIndex, l = 0; 100 > l; l++) a =
                    this.animatedObjects[k], f = this.getObjectAnimationFramePercent(a, b), g = Matrix.identity(), a.evaluateLocalTransformAtFramePercent(f, g, !0, e), (f = a.modelPartIndex != a.id) ? (f = Matrix.identity(), this.getAnimatedLocalTransform(a.id, b, f), h = Matrix.identity(), Matrix.mul(h, g, c), Matrix.mul(c, f, h)) : (h = Matrix.identity(), Matrix.copy(h, c), Matrix.mul(c, g, h)), k == a.parentIndex && (l = 100), k = a.parentIndex;
            c[12] *= d;
            c[13] *= d;
            c[14] *= d
        }
    };
    Animation.prototype.hasParentInHierarchy = function (a, b) {
        for (var c = a.parentIndex, d = 0; 100 > d; d++) {
            a = this.animatedObjects[c];
            if (a.id == b) return !0;
            c == a.parentIndex && (d = 100);
            c = a.parentIndex
        }
        return !1
    };
    Animation.prototype.hasParentTypeInHierarchy = function (a, b) {
        for (var c = a.parentIndex, d = 0; 100 > d; d++) {
            a = this.animatedObjects[c];
            if (a.sceneObjectType == b) return !0;
            c == a.parentIndex && (d = 100);
            c = a.parentIndex
        }
        return !1
    };
    Animation.prototype.searchAnimationUpHierarchy = function (a) {
        for (var b = a.id, c = 0; 100 > c; c++) {
            a = this.animatedObjects[b];
            if (a.animatedLocalTransform && (a.hasAnimatedTransform() || a.id != a.modelPartIndex && this.searchAnimationUpHierarchy(this.animatedObjects[a.modelPartIndex]))) return !0;
            b == a.parentIndex && (c = 100);
            b = a.parentIndex
        }
        return !1
    };
    Animation.prototype.hasAnimationInHierarchy = function (a) {
        return this.searchAnimationUpHierarchy(a) || a.id != a.modelPartIndex && this.searchAnimationUpHierarchy(this.animatedObjects[a.modelPartIndex]) || this.hasParentTypeInHierarchy(a, "TurnTableSO") || this.hasParentTypeInHierarchy(a, "CameraSO") || "CameraSO" == a.sceneObjectType ? !0 : !1
    };
    Animation.prototype.getObjectAnimationFramePercent = function (a, b) {
        if (0 == this.totalFrames || 0 == a.animationLength) return 0;
        if (a.endTime == this.totalSeconds) return b * a.modelPartFPS;
        var c = b / a.animationLength,
            c = Math.floor(c);
        b -= a.animationLength * c;
        c = b * a.modelPartFPS;
        c >= a.totalFrames + 1 && (c = a.totalFrames);
        return c
    };

    function Archive(a) {
        this.files = [];
        for (a = new ByteStream(a); !a.empty();) {
            var b = {};
            b.name = a.readCString();
            b.type = a.readCString();
            var c = a.readUint32(),
                d = a.readUint32(),
                e = a.readUint32();
            b.data = a.readBytes(d);
            if (!(b.data.length < d)) {
                if (c & 1 && (b.data = this.decompress(b.data, e), null === b.data)) continue;
                this.files[b.name] = b
            }
        }
    }
    Archive.prototype.get = function (a) {
        return this.files[a]
    };
    Archive.prototype.extract = function (a) {
        var b = this.files[a];
        delete this.files[a];
        return b
    };
    Archive.prototype.checkSignature = function (a) {
        if (!a) return !1;
        var b = this.get(a.name + ".sig");
        if (!b) return !1;
        b = JSON.parse(String.fromCharCode.apply(null, b.data));
        if (!b) return !1;
        for (var c = 5381, d = 0; d < a.data.length; ++d) c = 33 * c + a.data[d] & 4294967295;
        a = new BigInt;
        a.setBytes([0, 233, 33, 170, 116, 86, 29, 195, 228, 46, 189, 3, 185, 31, 245, 19, 159, 105, 73, 190, 158, 80, 175, 38, 210, 116, 221, 229, 171, 134, 104, 144, 140, 5, 99, 255, 208, 78, 248, 215, 172, 44, 79, 83, 5, 244, 152, 19, 92, 137, 112, 10, 101, 142, 209, 100, 244, 92, 190, 125, 28, 0, 185, 54, 143, 247, 49,
            37, 15, 254, 142, 180, 185, 232, 50, 219, 11, 186, 106, 116, 78, 212, 10, 105, 53, 26, 14, 181, 80, 47, 87, 213, 182, 19, 126, 151, 86, 109, 182, 224, 37, 135, 80, 59, 22, 93, 125, 68, 214, 106, 209, 152, 235, 157, 249, 245, 48, 76, 203, 0, 0, 95, 200, 246, 243, 229, 85, 79, 169
        ], !0);
        d = new BigInt;
        d.setBytes(b[0]);
        return d.powmod(65537, a).toInt32() != c ? !1 : !0
    };
    Archive.prototype.decompress = function (a, b) {
        var c = new Uint8Array(b),
            d = 0,
            e = new Uint32Array(4096),
            f = new Uint32Array(4096),
            g = 256,
            h = a.length,
            k = 0,
            l = 1,
            n = 0,
            m = 1;
        c[d++] = a[0];
        for (var p = 1;; p++) {
            m = p + (p >> 1);
            if (m + 1 >= h) break;
            var n = a[m + 1],
                m = a[m],
                r = p & 1 ? n << 4 | m >> 4 : (n & 15) << 8 | m;
            if (r < g)
                if (256 > r) n = d, m = 1, c[d++] = r;
                else
                    for (var n = d, m = f[r], r = e[r], s = r + m; r < s;) c[d++] = c[r++];
            else if (r == g) {
                n = d;
                m = l + 1;
                r = k;
                for (s = k + l; r < s;) c[d++] = c[r++];
                c[d++] = c[k]
            } else break;
            e[g] = k;
            f[g++] = l + 1;
            k = n;
            l = m;
            g = 4096 <= g ? 256 : g
        }
        return d == b ? c : null
    };

    function BigInt(a) {
        this.digits = new Uint16Array(a || 0)
    }
    BigInt.prototype.setBytes = function (a, b) {
        var c = (a.length + 1) / 2 | 0;
        this.digits = new Uint16Array(c);
        if (b)
            for (var d = 0, c = a.length - 1; 0 <= c; c -= 2) this.digits[d++] = a[c] + (0 < c ? 256 * a[c - 1] : 0);
        else
            for (d = 0; d < c; ++d) this.digits[d] = a[2 * d] + 256 * a[2 * d + 1];
        this.trim()
    };
    BigInt.prototype.toInt32 = function () {
        var a = 0;
        0 < this.digits.length && (a = this.digits[0], 1 < this.digits.length && (a |= this.digits[1] << 16));
        return a
    };
    BigInt.prototype.lessThan = function (a) {
        if (this.digits.length == a.digits.length)
            for (var b = this.digits.length - 1; 0 <= b; --b) {
                var c = this.digits[b],
                    d = a.digits[b];
                if (c != d) return c < d
            }
        return this.digits.length < a.digits.length
    };
    BigInt.prototype.shiftRight = function () {
        for (var a = 0, b = this.digits, c = b.length - 1; 0 <= c; --c) {
            var d = b[c];
            b[c] = d >> 1 | a << 15;
            a = d
        }
        this.trim()
    };
    BigInt.prototype.shiftLeft = function (a) {
        if (0 < a) {
            var b = a / 16 | 0;
            a %= 16;
            for (var c = 16 - a, d = this.digits.length + b + 1, e = new BigInt(d), f = 0; f < d; ++f) e.digits[f] = ((f < b || f >= this.digits.length + b ? 0 : this.digits[f - b]) << a | (f < b + 1 ? 0 : this.digits[f - b - 1]) >>> c) & 65535;
            e.trim();
            return e
        }
        return new BigInt(this)
    };
    BigInt.prototype.bitCount = function () {
        var a = 0;
        if (0 < this.digits.length)
            for (var a = 16 * (this.digits.length - 1), b = this.digits[this.digits.length - 1]; b;) b >>>= 1, ++a;
        return a
    };
    BigInt.prototype.sub = function (a) {
        var b = this.digits,
            c = a.digits,
            d = this.digits.length;
        a = a.digits.length;
        for (var e = 0, f = 0; f < d; ++f) {
            var g = b[f],
                h = f < a ? c[f] : 0,
                h = h + e,
                e = h > g ? 1 : 0,
                g = g + (e << 16);
            b[f] = g - h & 65535
        }
        this.trim()
    };
    BigInt.prototype.mul = function (a) {
        for (var b = new BigInt(this.digits.length + a.digits.length), c = b.digits, d = 0; d < this.digits.length; ++d)
            for (var e = this.digits[d], f = 0; f < a.digits.length; ++f)
                for (var g = e * a.digits[f], h = d + f; g;) {
                    var k = (g & 65535) + c[h];
                    c[h] = k & 65535;
                    g >>>= 16;
                    g += k >>> 16;
                    ++h
                }
        b.trim();
        return b
    };
    BigInt.prototype.mod = function (a) {
        if (0 >= this.digits.length || 0 >= a.digits.length) return new BigInt(0);
        var b = new BigInt(this.digits);
        if (!this.lessThan(a)) {
            for (var c = new BigInt(a.digits), c = c.shiftLeft(b.bitCount() - c.bitCount()); !b.lessThan(a);) c.lessThan(b) && b.sub(c), c.shiftRight();
            b.trim()
        }
        return b
    };
    BigInt.prototype.powmod = function (a, b) {
        for (var c = new BigInt([1]), d = this.mod(b); a;) a & 1 && (c = c.mul(d).mod(b)), a >>>= 1, d = d.mul(d).mod(b);
        return c
    };
    BigInt.prototype.trim = function () {
        for (var a = this.digits.length; 0 < a && 0 == this.digits[a - 1];) --a;
        a != this.digits.length && (this.digits = this.digits.subarray(0, a))
    };

    function Bounds(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b].bounds;
            if (void 0 === this.min) this.min = [c.min[0], c.min[1], c.min[2]], this.max = [c.max[0], c.max[1], c.max[2]];
            else
                for (var d = 0; 3 > d; ++d) this.min[d] = Math.min(c.min[d], this.min[d]), this.max[d] = Math.max(c.max[d], this.max[d])
        }
        this.min = this.min ? this.min : [0, 0, 0];
        this.max = this.max ? this.max : [0, 0, 0];
        this.center = [0.5 * (this.min[0] + this.max[0]), 0.5 * (this.min[1] + this.max[1]), 0.5 * (this.min[2] + this.max[2])];
        this.radius = [this.max[0] - this.center[0], this.max[1] - this.center[1],
            this.max[2] - this.center[2]
        ];
        this.radiusDiagonal = Math.sqrt(this.radius[0] * this.radius[0] + this.radius[1] * this.radius[1] + this.radius[2] * this.radius[2])
    };

    function Button(a) {
        this.name = "none";
        this.text = "default text";
        this.title = "none";
        this.debugString = this.imagePath = "";
        this.controlRect = new ControlRect(a);
        this.defaultAlpha = 0.5;
        this.focusAlpha = 1;
        this.updateAlphas = !0;
        this.linkedBackground = this.backgroundOffsetY = this.backgroundOffsetX = this.edgePixelsY = this.edgePixelsX = this.backgroundBottomMiddle = this.backgroundBottomRight = this.backgroundBottomLeft = this.backgroundMiddleMiddle = this.backgroundMiddleRight = this.backgroundMiddleLeft = this.backgroundTopMiddle = this.backgroundTopRight =
            this.backgroundTopLeft = this.backgroundMiddle = this.backgroundRight = this.backgroundLeft = 0
    }
    Button.prototype.setBackground3x1 = function (a, b, c, d, e, f, g) {
        this.backgroundOffsetX = b;
        this.backgroundOffsetY = c;
        this.edgePixelsX = g;
        this.backgroundLeft = a.addImage(d);
        this.backgroundMiddle = a.addImage(e);
        this.backgroundRight = a.addImage(f);
        this.backgroundLeft.linkedControl.style.zIndex = "0";
        this.backgroundMiddle.linkedControl.style.zIndex = "0";
        this.backgroundRight.linkedControl.style.zIndex = "0";
        this.setOpacity(this.defaultAlpha)
    };
    Button.prototype.setBackground3x3 = function (a, b, c, d, e, f, g, h, k, l, n, m, p, r) {
        this.backgroundOffsetX = b;
        this.backgroundOffsetY = c;
        this.edgePixelsX = p;
        this.edgePixelsY = r;
        this.backgroundTopLeft = a.addImage(d);
        this.backgroundMiddleLeft = a.addImage(g);
        this.backgroundBottomLeft = a.addImage(l);
        this.backgroundTopMiddle = a.addImage(e);
        this.backgroundMiddleMiddle = a.addImage(h);
        this.backgroundBottomMiddle = a.addImage(n);
        this.backgroundTopRight = a.addImage(f);
        this.backgroundMiddleRight = a.addImage(k);
        this.backgroundBottomRight =
            a.addImage(m);
        this.backgroundTopLeft.linkedControl.style.zIndex = "0";
        this.backgroundTopRight.linkedControl.style.zIndex = "0";
        this.backgroundTopMiddle.linkedControl.style.zIndex = "0";
        this.backgroundMiddleLeft.linkedControl.style.zIndex = "0";
        this.backgroundMiddleRight.linkedControl.style.zIndex = "0";
        this.backgroundMiddleMiddle.linkedControl.style.zIndex = "0";
        this.backgroundBottomLeft.linkedControl.style.zIndex = "0";
        this.backgroundBottomRight.linkedControl.style.zIndex = "0";
        this.backgroundBottomMiddle.linkedControl.style.zIndex =
            "0";
        this.setOpacity(this.defaultAlpha)
    };
    Button.prototype.alignBackground = function () {
        var a = this.controlRect,
            b = a.guiScreen,
            c = b.left * (1 - a.getScreenXPercent()),
            d = b.bottom * (1 - a.getScreenYPercent()),
            e = b.width * a.getScreenWidthPercent(),
            a = b.height * a.getScreenHeightPercent(),
            d = d + this.backgroundOffsetY,
            c = c + this.backgroundOffsetX;
        if (this.backgroundTopLeft && this.backgroundTopRight && this.backgroundTopMiddle && this.backgroundMiddleLeft && this.backgroundMiddleRight && this.backgroundMiddleMiddle && this.backgroundBottomLeft && this.backgroundBottomRight && this.backgroundBottomMiddle) {
            var b =
                e - 2 * this.edgePixelsX,
                f = a - 2 * this.edgePixelsY;
            this.backgroundTopLeft.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundTopMiddle.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundTopRight.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundBottomLeft.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundBottomMiddle.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundBottomRight.linkedControl.style.height = this.edgePixelsY + "px";
            this.backgroundMiddleLeft.linkedControl.style.height =
                f + "px";
            this.backgroundMiddleMiddle.linkedControl.style.height = f + "px";
            this.backgroundMiddleRight.linkedControl.style.height = f + "px";
            this.backgroundTopLeft.linkedControl.style.width = this.edgePixelsX + "px";
            this.backgroundBottomLeft.linkedControl.style.width = this.edgePixelsX + "px";
            this.backgroundMiddleLeft.linkedControl.style.width = this.edgePixelsX + "px";
            this.backgroundTopRight.linkedControl.style.width = this.edgePixelsX + "px";
            this.backgroundBottomRight.linkedControl.style.width = this.edgePixelsX + "px";
            this.backgroundMiddleRight.linkedControl.style.width =
                this.edgePixelsX + "px";
            this.backgroundTopMiddle.linkedControl.style.width = b + "px";
            this.backgroundBottomMiddle.linkedControl.style.width = b + "px";
            this.backgroundMiddleMiddle.linkedControl.style.width = b + "px";
            this.backgroundTopLeft.linkedControl.style.left = c + "px";
            this.backgroundBottomLeft.linkedControl.style.left = c + "px";
            this.backgroundMiddleLeft.linkedControl.style.left = c + "px";
            c += this.edgePixelsX;
            this.backgroundTopMiddle.linkedControl.style.left = c + "px";
            this.backgroundBottomMiddle.linkedControl.style.left =
                c + "px";
            this.backgroundMiddleMiddle.linkedControl.style.left = c + "px";
            c += b;
            this.backgroundTopRight.linkedControl.style.left = c + "px";
            this.backgroundBottomRight.linkedControl.style.left = c + "px";
            this.backgroundMiddleRight.linkedControl.style.left = c + "px";
            this.backgroundBottomLeft.linkedControl.style.bottom = d + "px";
            this.backgroundBottomMiddle.linkedControl.style.bottom = d + "px";
            this.backgroundBottomRight.linkedControl.style.bottom = d + "px";
            d += this.edgePixelsY;
            this.backgroundMiddleLeft.linkedControl.style.bottom =
                d + "px";
            this.backgroundMiddleRight.linkedControl.style.bottom = d + "px";
            this.backgroundMiddleMiddle.linkedControl.style.bottom = d + "px";
            d += f;
            this.backgroundTopLeft.linkedControl.style.bottom = d + "px";
            this.backgroundTopMiddle.linkedControl.style.bottom = d + "px";
            this.backgroundTopRight.linkedControl.style.bottom = d + "px"
        }
        this.backgroundLeft && this.backgroundRight && this.backgroundMiddle && (e -= 2 * this.edgePixelsX, this.backgroundLeft.linkedControl.style.bottom = d + "px", this.backgroundMiddle.linkedControl.style.bottom =
            d + "px", this.backgroundRight.linkedControl.style.bottom = d + "px", this.backgroundLeft.linkedControl.style.height = a + "px", this.backgroundMiddle.linkedControl.style.height = a + "px", this.backgroundRight.linkedControl.style.height = a + "px", this.backgroundLeft.linkedControl.style.width = this.edgePixelsX + "px", this.backgroundMiddle.linkedControl.style.width = e + "px", this.backgroundRight.linkedControl.style.width = this.edgePixelsX + "px", this.backgroundLeft.linkedControl.style.left = c + "px", c += this.edgePixelsX, this.backgroundMiddle.linkedControl.style.left =
            c + "px", this.backgroundRight.linkedControl.style.left = c + e + "px")
    };
    Button.prototype.setOpacity = function (a) {
        this.controlRect.linkedControl.style.opacity = a;
        this.backgroundLeft && (this.backgroundLeft.linkedControl.style.opacity = a);
        this.backgroundRight && (this.backgroundRight.linkedControl.style.opacity = a);
        this.backgroundMiddle && (this.backgroundMiddle.linkedControl.style.opacity = a);
        this.backgroundTopLeft && (this.backgroundTopLeft.linkedControl.style.opacity = a);
        this.backgroundTopRight && (this.backgroundTopRight.linkedControl.style.opacity = a);
        this.backgroundTopMiddle && (this.backgroundTopMiddle.linkedControl.style.opacity =
            a);
        this.backgroundMiddleLeft && (this.backgroundMiddleLeft.linkedControl.style.opacity = a);
        this.backgroundMiddleRight && (this.backgroundMiddleRight.linkedControl.style.opacity = a);
        this.backgroundMiddleMiddle && (this.backgroundMiddleMiddle.linkedControl.style.opacity = a);
        this.backgroundBottomLeft && (this.backgroundBottomLeft.linkedControl.style.opacity = a);
        this.backgroundBottomRight && (this.backgroundBottomRight.linkedControl.style.opacity = a);
        this.backgroundBottomMiddle && (this.backgroundBottomMiddle.linkedControl.style.opacity =
            a)
    };
    Button.prototype.setBackgroundVisible = function (a) {
        this.backgroundLeft && this.backgroundLeft.showControl(a);
        this.backgroundRight && this.backgroundRight.showControl(a);
        this.backgroundMiddle && this.backgroundMiddle.showControl(a);
        this.backgroundTopLeft && this.backgroundTopLeft.showControl(a);
        this.backgroundTopRight && this.backgroundTopRight.showControl(a);
        this.backgroundTopMiddle && this.backgroundTopMiddle.showControl(a);
        this.backgroundMiddleLeft && this.backgroundMiddleLeft.showControl(a);
        this.backgroundMiddleRight && this.backgroundMiddleRight.showControl(a);
        this.backgroundMiddleMiddle && this.backgroundMiddleMiddle.showControl(a);
        this.backgroundBottomLeft && this.backgroundBottomLeft.showControl(a);
        this.backgroundBottomRight && this.backgroundBottomRight.showControl(a);
        this.backgroundBottomMiddle && this.backgroundBottomMiddle.showControl(a)
    };
    Button.prototype.setVisible = function (a) {
        this.controlRect.showControl(a);
        this.setBackgroundVisible(a)
    };
    Button.prototype.linkControl = function (a) {
        this.controlRect.linkedControl = a;
        a.onmouseover = function () {
            this.updateAlphas && (this.setOpacity(this.focusAlpha), this.controlRect.mouseOver = !0, this.linkedBackground && this.linkedBackground.setOpacity(this.focusAlpha))
        }.bind(this);
        a.onmouseout = function () {
            this.updateAlphas && (this.setOpacity(this.defaultAlpha), this.controlRect.mouseOver = !1, this.linkedBackground && this.linkedBackground.setOpacity(this.defaultAlpha))
        }.bind(this)
    };

    function ByteStream(a) {
        this.bytes = new Uint8Array(a)
    }
    ByteStream.prototype.empty = function () {
        return 0 >= this.bytes.length
    };
    ByteStream.prototype.readCString = function () {
        for (var a = this.bytes, b = a.length, c = 0; c < b; ++c)
            if (0 == a[c]) return a = String.fromCharCode.apply(null, this.bytes.subarray(0, c)), this.bytes = this.bytes.subarray(c + 1), a;
        return null
    };
    ByteStream.prototype.asString = function () {
        for (var a = "", b = 0; b < this.bytes.length; ++b) a += String.fromCharCode(this.bytes[b]);
        return a
    };
    ByteStream.prototype.readBytes = function (a) {
        var b = this.bytes.subarray(0, a);
        this.bytes = this.bytes.subarray(a);
        return b
    };
    ByteStream.prototype.readUint32 = function () {
        var a = this.bytes,
            b = a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24;
        this.bytes = a.subarray(4);
        return b
    };
    ByteStream.prototype.readUint8 = function () {
        var a = this.bytes,
            b = a[0];
        this.bytes = a.subarray(1);
        return b
    };
    ByteStream.prototype.readUint16 = function () {
        var a = this.bytes,
            b = a[0] | a[1] << 8;
        this.bytes = a.subarray(2);
        return b
    };
    ByteStream.prototype.readFloat32 = function () {
        var a = new Uint8Array(this.bytes),
            a = new Float32Array(a.buffer);
        this.bytes = this.bytes.subarray(4);
        return a[0]
    };
    ByteStream.prototype.seekUint32 = function (a) {
        a = this.bytes.subarray(4 * a);
        return a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24
    };
    ByteStream.prototype.seekFloat32 = function (a) {
        a = new Uint8Array(this.bytes.subarray(4 * a));
        return (new Float32Array(a.buffer))[0]
    };
    ByteStream.prototype.getMatrix = function (a) {
        return new Float32Array(this.bytes.buffer, 64 * a, 16)
    };

    function ControlRect(a) {
        this.name = "none";
        this.title = "frame";
        this.yPercent = this.xPercent = 0;
        this.heightPercent = this.widthPercent = 1;
        this.debugString = "";
        this.parentControlRect = 0;
        this.childControlRects = [];
        this.clicked = this.mouseDown = this.mouseOver = !1;
        this.localMouseYPercent = this.localMouseXPercent = 0;
        this.enabled = this.visible = !0;
        this.opacity = 1;
        this.guiScreen = a;
        this.id = this.callBack = this.linkedControl = 0
    }
    ControlRect.prototype.getScreenWidth = function () {
        if (this.linkedControl) return this.guiScreen.width * this.getScreenWidthPercent()
    };
    ControlRect.prototype.getScreenHeight = function () {
        if (this.linkedControl) return this.guiScreen.height * this.getScreenHeightPercent()
    };
    ControlRect.prototype.updateElement = function () {
        var a = this.linkedControl;
        if (a) {
            var b = this.guiScreen.left * (1 - this.getScreenXPercent()),
                c = this.guiScreen.bottom * (1 - this.getScreenYPercent()),
                d = this.guiScreen.width * this.getScreenWidthPercent(),
                e = this.guiScreen.height * this.getScreenHeightPercent();
            a.style.left = b + "px";
            a.style.bottom = c + "px";
            a.style.width = d + "px";
            a.style.height = e + "px"
        }
    };
    ControlRect.prototype.updateElement = function () {
        var a = this.linkedControl;
        if (a) {
            var b = this.guiScreen.left * (1 - this.getScreenXPercent()),
                c = this.guiScreen.bottom * (1 - this.getScreenYPercent()),
                d = this.guiScreen.width * this.getScreenWidthPercent(),
                e = this.guiScreen.height * this.getScreenHeightPercent();
            a.style.left = b + "px";
            a.style.bottom = c + "px";
            a.style.width = d + "px";
            a.style.height = e + "px"
        }
    };
    ControlRect.prototype.updateChildElements = function () {
        this.updateElement();
        for (var a = 0; a < this.childControlRects.length; a++) this.childControlRects[a].updateChildElements()
    };
    ControlRect.prototype.set = function (a, b, c, d) {
        this.xPercent = a;
        this.yPercent = b;
        this.widthPercent = c;
        this.heightPercent = d
    };
    ControlRect.prototype.linkControl = function (a) {
        this.linkedControl = a;
        a.onmouseover = function () {
            this.mouseOver = !0
        }.bind(this);
        a.onmouseout = function () {
            this.mouseOver = !1
        }.bind(this);
        a.onmousedown = function () {
            this.mouseDown = !0
        }.bind(this);
        a.onmouseup = function () {
            this.mouseDown = !1
        }.bind(this);
        a.onclick = function () {
            this.callBack && this.callBack(this);
            this.clicked = !0
        }.bind(this)
    };
    ControlRect.prototype.showControl = function (a) {
        this.visible = a;
        this.linkedControl && (this.linkedControl.style.display = a ? "block" : "none")
    };
    ControlRect.prototype.setOpacity = function (a) {
        this.opacity = a;
        this.linkedControl && (this.linkedControl.style.opacity = a)
    };
    ControlRect.prototype.hasChildControlRect = function (a) {
        for (var b = 0; b < this.childControlRects.length; b++)
            if (this.childControlRects[b] == a) return !0;
        return !1
    };
    ControlRect.prototype.registerChildControlRect = function (a) {
        this.hasChildControlRect(a) || (this.childControlRects.push(a), a.parentControlRect = this)
    };
    ControlRect.prototype.getScreenWidthPercent = function () {
        var a = this.widthPercent;
        this.parentControlRect && (a *= this.parentControlRect.getScreenWidthPercent());
        return a
    };
    ControlRect.prototype.getScreenHeightPercent = function () {
        var a = this.heightPercent;
        this.parentControlRect && (a *= this.parentControlRect.getScreenHeightPercent());
        return a
    };
    ControlRect.prototype.getScreenXPercent = function () {
        var a = this.xPercent;
        this.parentControlRect && (a *= this.parentControlRect.getScreenWidthPercent(), a += this.parentControlRect.getScreenXPercent());
        return a
    };
    ControlRect.prototype.getScreenYPercent = function () {
        var a = this.yPercent;
        this.parentControlRect && (a *= this.parentControlRect.getScreenHeightPercent(), a += this.parentControlRect.getScreenYPercent());
        return a
    };
    var prepareEmbedParams = function (a) {
            a = a || {};
            if (document.location.search)
                for (var b = document.location.search.substring(1).split("&"), c = 0; c < b.length; ++c) {
                    var d = b[c].split("=");
                    a[d[0]] = d[1]
                }
            b = function (a) {
                if (a | 0) return !0;
                for (var c = "true True TRUE yes Yes YES".split(" "), b = 0; b < c.length; ++b)
                    if (a === c[b]) return !0;
                return !1
            };
            a.width = a.width || 800;
            a.height = a.height || 600;
            a.autoStart = b(a.autoStart);
            a.pagePreset = b(a.pagePreset);
            a.fullFrame = b(a.fullFrame) || b(a.bare);
            a.fullFrame = !a.pagePreset && a.fullFrame;
            return a
        },
        embed = function (a, b) {
            var c;
            b = prepareEmbedParams(b);
            var d = b.thumbnailURL;
            if (b.pagePreset) {
                c = new WebViewer(b.width, b.height, a, !!d);
                document.body.style.backgroundColor = "#d7e4da";
                var e = document.createElement("div");
                e.style.position = "relative";
                e.style.backgroundColor = "#e4e7e4";
                e.style.width = b.width + 12 + "px";
                e.style.height = b.height + 6 + 16 + "px";
                e.style.margin = "auto";
                e.style.boxShadow = "3px 5px 12px 0px grey";
                document.body.appendChild(e);
                var f = document.createElement("div");
                f.style.position = "relative";
                f.style.left =
                    "6px";
                f.style.top = "6px";
                e.appendChild(f);
                f.appendChild(c.domRoot);
                if (!c.mobile) {
                    e.style.resize = "both";
                    e.style.overflow = "hidden";
                    var g = [e.style.width, e.style.height],
                        h = function () {
                            if (FullScreen.active()) e.style.resize = "none";
                            else if (e.style.resize = "both", g[0] != e.style.width || g[1] != e.style.height) g[0] = e.style.width, g[1] = e.style.height, c.resize(e.clientWidth - 12, e.clientHeight - 6 - 16);
                            window.setTimeout(h, 100)
                        };
                    h()
                }
            } else c = new WebViewer(b.fullFrame ? window.innerWidth : b.width, b.fullFrame ? window.innerHeight :
                b.height, a, !!d), document.body.appendChild(c.domRoot), b.fullFrame && (c.domRoot.style.position = "absolute", c.domRoot.style.left = c.domRoot.style.top = 0, window.addEventListener("resize", function () {
                FullScreen.active() || c.resize(window.innerWidth, window.innerHeight)
            }));
            c.ui.setThumbnailURL(d);
            b.autoStart && c.loadScene();
            return c
        },
        fetchThumbnail = function (a, b, c, d) {
            var e = !1,
                f = a + (-1 == a.indexOf("?") ? "?" : "&") + "thumb=1",
                g = function (a) {
                    (a = (new Archive(a)).extract("thumbnail.jpg")) ? TextureCache.parseFile(a, b, d): e ? c &&
                        c() : (e = !0, Network.fetchBinaryIncremental(f, g, c, 394240));
                    return 0
                };
            Network.fetchBinaryIncremental(f, g, c, 65536)
        },
        marmoset = "undefined" == typeof marmoset ? {} : marmoset;
    marmoset.embed = embed;
    marmoset.fetchThumbnail = fetchThumbnail;

    function Fog(a, b) {
        this.desc = b;
        this.gl = a;
        this.iblShader = a.shaderCache.fromURLs("fogvert.glsl", "fogfrag.glsl", ["#define FOG_IBL"]);
        var c = ["#define FOG_DIR"];
        this.dirShader = a.shaderCache.fromURLs("fogvert.glsl", "fogfrag.glsl", c);
        c.push("#define FOG_SHADOWS");
        this.dirShaderShadow = a.shaderCache.fromURLs("fogvert.glsl", "fogfrag.glsl", c);
        c = ["#define FOG_SPOT"];
        this.spotShader = a.shaderCache.fromURLs("fogvert.glsl", "fogfrag.glsl", c);
        c.push("#define FOG_SHADOWS");
        this.spotShaderShadow = a.shaderCache.fromURLs("fogvert.glsl",
            "fogfrag.glsl", c);
        c = ["#define FOG_OMNI"];
        this.omniShaderShadow = this.omniShader = a.shaderCache.fromURLs("fogvert.glsl", "fogfrag.glsl", c);
        this.fullscreenTriangle = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, this.fullscreenTriangle);
        c = new Float32Array([0, 0, 2, 0, 0, 2]);
        a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW);
        a.bindBuffer(a.ARRAY_BUFFER, null)
    }
    Fog.prototype.draw = function (a, b) {
        var c = this.gl,
            d = a.view,
            e = d.projectionMatrix,
            f = Matrix.empty();
        Matrix.mul(f, d.viewMatrix, d.projectionMatrix);
        Matrix.invert(f, d.viewProjectionMatrix);
        f = [e[10] + e[11], -e[14], -2 * e[11]];
        e = [-2 / e[0], -2 / e[5], (1 - e[8]) / e[0], (1 - e[9]) / e[5]];
        c.enable(c.BLEND);
        c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA);
        for (var g = 0; g < a.lights.count + 1; ++g) {
            var h = g - 1,
                k = h < a.lights.shadowCount,
                l;
            l = 0 == g ? this.iblShader : 0 < a.lights.spot[3 * h] ? k ? this.spotShaderShadow : this.spotShader : 0 < a.lights.getLightPos(h)[3] ?
                this.omniShader : k ? this.dirShaderShadow : this.dirShader;
            l.bind();
            var n = l.params;
            c.uniform3fv(n.uDepthToZ, f);
            c.uniform4fv(n.uUnproject, e);
            c.uniformMatrix4fv(n.uInvViewMatrix, !1, d.transform);
            c.uniform1f(n.uFogInvDistance, 1 / this.desc.distance);
            c.uniform1f(n.uFogOpacity, this.desc.opacity * (1 - a.stripData.activeFade()));
            c.uniform1f(n.uFogDispersion, 1 - this.desc.dispersion);
            var m = [0, 0, 0];
            m[this.desc.type] = 1;
            c.uniform3fv(n.uFogType, m);
            c.uniform3fv(n.uFogColor, this.desc.color);
            c.uniform1f(n.uFogIllum, 0 == g ? this.desc.skyIllum :
                this.desc.lightIllum);
            c.uniformMatrix4fv(n.uLightMatrix, !1, a.lights.invMatrix);
            if (0 == g) {
                h = new Float32Array(a.sky.diffuseCoefficients);
                for (k = 4; 16 > k; ++k) h[k] *= 1 - this.desc.dispersion;
                for (k = 16; 36 > k; ++k) h[k] *= 1 - this.desc.dispersion * this.desc.dispersion;
                c.uniform4fv(n.uFogLightSphere, h)
            } else {
                var p = a.lights.getLightPos(h),
                    p = Matrix.mul4(Vect.empty(), a.lights.invMatrix, p[0], p[1], p[2], p[3]),
                    m = a.lights.getLightDir(h),
                    m = Matrix.mulVec(Vect.empty(), a.lights.invMatrix, m[0], m[1], m[2]);
                c.uniform4fv(n.uLightPosition,
                    p);
                c.uniform3fv(n.uLightColor, a.lights.getColor(h));
                var p = 0.01745329251 * a.lights.spot[3 * h],
                    r = Math.cos(0.5 * p);
                c.uniform4fv(n.uSpotParams, [-m[0], -m[1], -m[2], 0 < p ? r * r : 0]);
                c.uniform4fv(n.uLightAttenuation, [a.lights.parameters[3 * h + 0], a.lights.parameters[3 * h + 1], a.lights.parameters[3 * h + 2], r]);
                k && (k = Matrix.mul(Matrix.empty(), a.lights.finalTransformBuffer.subarray(16 * h), a.lights.matrix), c.uniformMatrix4fv(n.uShadowProj, !1, k), a.shadow.depthTextures[h].bind(l.samplers.uShadowMap), h = 0, 1 < a.postRender.sampleCount &&
                    (h = a.postRender.currentSample() / a.postRender.sampleCount), c.uniform1f(n.uDitherOffset, h), c.uniform3fv(n.uAABBMin, a.bounds.min), c.uniform3fv(n.uAABBMax, a.bounds.max), h = Vect.lerp(Vect.empty(), a.bounds.min, a.bounds.max, 0.5), k = Vect.distance(h, a.bounds.min), c.uniform4f(n.uCylinder, h[0], h[1], h[2], k * k))
            }
            b.bind(l.samplers.tDepth);
            l = l.attribs.vCoord;
            c.bindBuffer(c.ARRAY_BUFFER, this.fullscreenTriangle);
            c.enableVertexAttribArray(l);
            c.vertexAttribPointer(l, 2, c.FLOAT, !1, 0, 0);
            c.drawArrays(c.TRIANGLES, 0, 3);
            c.disableVertexAttribArray(l);
            c.bindBuffer(c.ARRAY_BUFFER, null)
        }
        c.disable(c.BLEND)
    };
    Fog.prototype.complete = function () {
        return this.iblShader.complete() && this.dirShader.complete() && this.dirShaderShadow.complete() && this.spotShader.complete() && this.spotShaderShadow.complete() && this.omniShader.complete() && this.omniShaderShadow.complete()
    };

    function Framebuffer(a, b) {
        this.gl = a;
        this.fbo = a.createFramebuffer();
        a.bindFramebuffer(a.FRAMEBUFFER, this.fbo);
        b && (this.width = b.width, this.height = b.height, b.color0 && (this.color0 = b.color0, a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.color0.id, 0), this.width = b.color0.desc.width, this.height = b.color0.desc.height), b.depth ? (this.depth = b.depth, a.framebufferTexture2D(a.FRAMEBUFFER, a.DEPTH_ATTACHMENT, a.TEXTURE_2D, this.depth.id, 0)) : (this.depthBuffer = b.depthBuffer, b.createDepth && !this.depthBuffer &&
            (this.depthBuffer = Framebuffer.createDepthBuffer(a, this.width, this.height)), this.depthBuffer && (a.bindRenderbuffer(a.RENDERBUFFER, this.depthBuffer), a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_ATTACHMENT, a.RENDERBUFFER, this.depthBuffer), a.bindRenderbuffer(a.RENDERBUFFER, null))));
        this.valid = b && b.ignoreStatus || a.checkFramebufferStatus(a.FRAMEBUFFER) == a.FRAMEBUFFER_COMPLETE;
        a.bindFramebuffer(a.FRAMEBUFFER, null)
    }
    Framebuffer.createDepthBuffer = function (a, b, c) {
        var d = a.createRenderbuffer();
        a.bindRenderbuffer(a.RENDERBUFFER, d);
        a.renderbufferStorage(a.RENDERBUFFER, a.DEPTH_COMPONENT16, b, c);
        a.bindRenderbuffer(a.RENDERBUFFER, null);
        return d
    };
    Framebuffer.prototype.bind = function () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
        this.gl.viewport(0, 0, this.width, this.height)
    };
    Framebuffer.bindNone = function (a) {
        a.bindFramebuffer(a.FRAMEBUFFER, null)
    };
    var FullScreen = {
        support: function () {
            return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
        },
        begin: function (a, b) {
            var c = a.requestFullscreen || a.webkitRequestFullScreen || a.mozRequestFullScreen || a.msRequestFullscreen;
            if (c) {
                var d = function () {
                    FullScreen.active() || (document.removeEventListener("fullscreenchange", d), document.removeEventListener("webkitfullscreenchange", d), document.removeEventListener("mozfullscreenchange", d), document.removeEventListener("MSFullscreenChange",
                        d));
                    b && b()
                };
                document.addEventListener("fullscreenchange", d);
                document.addEventListener("webkitfullscreenchange", d);
                document.addEventListener("mozfullscreenchange", d);
                document.addEventListener("MSFullscreenChange", d);
                c.bind(a)()
            }
        },
        end: function () {
            var a = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            a && a.bind(document)()
        },
        active: function () {
            return !!(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement || document.msFullscreenElement)
        }
    };

    function GUIManager(a) {
        this.init = !1;
        this.ui = a;
        this.bottom = this.left = this.height = this.width = 0;
        this.clicked = this.mouseDown = !1;
        this.playbackControls = 0;
        a = 1;
        window.devicePixelRatio && (2 < window.devicePixelRatio ? a = 4 : 1 < window.devicePixelRatio && (a = 2));
        this.imageSetNumber = a
    }
    GUIManager.prototype.setSize = function (a, b) {
        this.width = a;
        this.height = b;
        this.left = -a;
        this.bottom = -b;
        this.playbackControls && this.playbackControls.resize(this)
    };
    GUIManager.prototype.setupActiveView = function (a) {
        this.init || (this.init = !0, this.ui = a, a.viewer.scene.sceneAnimator && (this.playbackControls = new PlaybackControls(this), this.playbackControls.resize(this)))
    };
    GUIManager.prototype.updateElement = function (a) {
        var b = a.linkedControl;
        if (b) {
            var c = this.left * (1 - a.getScreenXPercent()),
                d = this.bottom * (1 - a.getScreenYPercent()),
                e = this.width * a.getScreenWidthPercent();
            a = this.height * a.getScreenHeightPercent();
            b.style.left = c + "px";
            b.style.bottom = d + "px";
            b.style.width = e + "px";
            b.style.height = a + "px"
        }
    };

    function GUIRegion(a) {
        this.debugString = "GUIRegion";
        this.name = "Default";
        this.controlRect = new ControlRect(a);
        this.yPercent = this.xPercent = 0;
        this.heightPercent = this.widthPercent = 1;
        this.guiScreen = a
    }
    GUIRegion.prototype.addImageElement = function (a, b) {
        var c = this.guiScreen.ui.menuCluster.contents,
            d = document.createElement("input");
        a.linkControl(d);
        this.guiScreen.updateElement(a);
        d.type = "image";
        d.src = marmoset.dataLocale + b;
        d.style.position = "absolute";
        d.style.border = "none";
        d.style.outline = "0px";
        d.style.zIndex = "1";
        d.title = b;
        d.style.opacity = a.opacity;
        var e = new XMLHttpRequest;
        e.open("HEAD", d.src, !0);
        e.onload = function (a) {
            a.appendChild(this)
        }.bind(d, c);
        e.send();
        return d
    };
    GUIRegion.prototype.addImage = function (a) {
        var b = new ControlRect(this.guiScreen);
        this.addImageElement(b, a);
        return b
    };
    GUIRegion.prototype.addTextButton = function (a, b, c, d, e, f) {
        var g = new Button(this.guiScreen);
        g.name = "none";
        g.text = a;
        g.controlRect.set(b, c, d, e);
        g.controlRect.opacity = f;
        this.controlRect.registerChildControlRect(g.controlRect);
        b = this.guiScreen.ui.menuCluster.contents;
        c = document.createElement("text");
        c.style.color = "white";
        c.style.fontFamily = "Arial";
        c.style.fontSize = marmoset.largeUI ? "14px" : "12px";
        c.style.textShadow = "2px 2px 3px #000000";
        b.appendChild(c);
        g.controlRect.linkControl(c);
        this.guiScreen.updateElement(g.controlRect);
        c.type = "text";
        c.name = "text";
        c.style.position = "absolute";
        c.style.border = "none";
        c.style.outline = "0px";
        c.style.zIndex = "2";
        c.innerHTML = a;
        c.style.opacity = g.controlRect.opacity;
        g.linkControl(c);
        return g
    };

    function GUIScreen(a) {
        this.init = !1;
        this.ui = a;
        this.bottom = this.left = this.height = this.width = 0;
        this.clicked = this.mouseDown = !1;
        this.playbackControls = 0;
        a = 1;
        window.devicePixelRatio && (2 < window.devicePixelRatio ? a = 4 : 1 < window.devicePixelRatio && (a = 2));
        this.imageSetNumber = a
    }
    GUIScreen.prototype.setSize = function (a, b) {
        this.width = a;
        this.height = b;
        this.left = -a;
        this.bottom = -b;
        this.playbackControls && this.playbackControls.resize(this)
    };
    GUIScreen.prototype.setupActiveView = function (a) {
        this.init || (this.init = !0, this.ui = a, a.viewer.scene.sceneAnimator && (this.playbackControls = new PlaybackControls(this), this.playbackControls.resize(this)))
    };
    GUIScreen.prototype.updateElement = function (a) {
        var b = a.linkedControl;
        if (b) {
            var c = this.left * (1 - a.getScreenXPercent()),
                d = this.bottom * (1 - a.getScreenYPercent()),
                e = this.width * a.getScreenWidthPercent();
            a = this.height * a.getScreenHeightPercent();
            b.style.left = c + "px";
            b.style.bottom = d + "px";
            b.style.width = e + "px";
            b.style.height = a + "px"
        }
    };

    function Input(a) {
        this.onTap = [];
        this.onSingleTap = [];
        this.onDoubleTap = [];
        this.onDrag = [];
        this.onZoom = [];
        this.onPan = [];
        this.onPan2 = [];
        this.onAnything = [];
        this.mouseDownCount = 0;
        this.macHax = 0 <= navigator.platform.toUpperCase().indexOf("MAC");
        a && this.attach(a)
    }
    Input.prototype.attach = function (a) {
        this.element = a;
        var b = function (a) {
            for (var b = 0; b < this.onAnything.length; ++b) this.onAnything[b]();
            a.preventDefault()
        }.bind(this);
        this.mouseStates = [{
            pressed: !1,
            position: [0, 0],
            downPosition: [0, 0]
        }, {
            pressed: !1,
            position: [0, 0],
            downPosition: [0, 0]
        }, {
            pressed: !1,
            position: [0, 0],
            downPosition: [0, 0]
        }];
        this.lastTapPos = [0, 0];
        a = function (a) {
            if (a.target === this.element) {
                this.mouseDownCount++;
                var d = this.mouseStates[a.button];
                if (d) {
                    d.pressed = !0;
                    var e = this.element.getBoundingClientRect();
                    d.position[0] = d.downPosition[0] = a.clientX - e.left;
                    d.position[1] = d.downPosition[1] = a.clientY - e.top;
                    b(a)
                }
            }
        }.bind(this);
        this.element.addEventListener("mousedown", a);
        a = function (a) {
            var d = this.mouseStates[a.button];
            if (d) {
                var e = this.element.getBoundingClientRect(),
                    f = a.clientX - e.left,
                    e = a.clientY - e.top;
                d.pressed = !1;
                d.position[0] = f;
                d.position[1] = e;
                if (0 == a.button && a.target == this.element && 10 > Math.abs(d.position[0] - d.downPosition[0]) + Math.abs(d.position[1] - d.downPosition[1])) {
                    for (var g = 0; g < this.onTap.length; ++g) this.onTap[g](f,
                        e);
                    this.needSingleClick = !0;
                    window.setTimeout(function (a, c) {
                        if (this.needSingleClick) {
                            for (var b = 0; b < this.onSingleTap.length; ++b) this.onSingleTap[b](a, c);
                            this.needSingleClick = !1
                        }
                    }.bind(this, f, e), 301);
                    d = !1;
                    if (void 0 !== this.doubleClickTimer && (g = 8 > Math.abs(f - this.lastTapPos[0]) + Math.abs(e - this.lastTapPos[1]), 300 > Date.now() - this.doubleClickTimer && g))
                        for (d = !0, this.needSingleClick = !1, g = 0; g < this.onDoubleTap.length; ++g) this.onDoubleTap[g](f, e);
                    this.doubleClickTimer = Date.now();
                    d && (this.doubleClickTimer = -1E9);
                    this.lastTapPos[0] = f;
                    this.lastTapPos[1] = e
                }
            }
            b(a)
        }.bind(this);
        this.element.addEventListener("mouseup", a);
        a = function (a) {
            for (var d = !1, e = this.element.getBoundingClientRect(), f = 0; 3 > f; ++f) {
                var g = this.mouseStates[f];
                if (g.pressed) {
                    var d = a.clientX - e.left,
                        h = a.clientY - e.top,
                        k = d - g.position[0],
                        l = h - g.position[1];
                    g.position[0] = d;
                    g.position[1] = h;
                    if (2 == f && a.altKey)
                        for (g = 0; g < this.onZoom.length; ++g) this.onZoom[g](2 * l);
                    else if (1 <= f || a.ctrlKey)
                        for (g = 0; g < this.onPan.length; ++g) this.onPan[g](k, l);
                    else if (0 == f)
                        if (a.shiftKey)
                            for (g =
                                0; g < this.onPan2.length; ++g) this.onPan2[g](k, l);
                        else
                            for (g = 0; g < this.onDrag.length; ++g) this.onDrag[g](d, h, k, l);
                    d = !0
                }
            }
            d && b(a)
        }.bind(this);
        this.element.addEventListener("mousemove", a);
        a = function (a) {
            var d = 0;
            a.deltaY ? (d = -0.4 * a.deltaY, 1 == a.deltaMode ? d *= 16 : 2 == a.deltaMode && (d *= this.element.clientHeight)) : a.wheelDelta ? d = this.macHax && 120 == Math.abs(a.wheelDelta) ? 0.08 * a.wheelDelta : 0.4 * a.wheelDelta : a.detail && (d = -10 * a.detail);
            for (var e = 0; e < this.onZoom.length; ++e) this.onZoom[e](d);
            b(a)
        }.bind(this);
        this.element.addEventListener("mousewheel",
            a);
        this.element.addEventListener("DOMMouseScroll", a);
        this.element.addEventListener("wheel", a);
        a = function (a) {
            for (var b = 0; b < this.mouseStates.length; ++b) this.mouseStates[b].pressed = !1;
            a.preventDefault()
        }.bind(this);
        this.element.addEventListener("mouseleave", a);
        this.element.addEventListener("contextmenu", function (a) {
            a.preventDefault()
        });
        this.touches = {};
        this.tapPossible = !1;
        this.touchCountFloor = 0;
        a = function (a) {
            for (var d = this.element.getBoundingClientRect(), e = !1, f = 0; f < a.changedTouches.length; ++f)
                if (a.target ===
                    this.element) {
                    var g = a.changedTouches[f],
                        e = {
                            x: g.clientX - d.left,
                            y: g.clientY - d.top
                        };
                    e.startX = e.x;
                    e.startY = e.y;
                    this.touches[g.identifier] = e;
                    e = !0
                } this.tapPossible = 1 == a.touches.length;
            for (g = d = 0; g < this.touches.length; ++g) d++;
            d > this.touchCountFloor && (this.touchCountFloor = d);
            e && b(a)
        }.bind(this);
        this.element.addEventListener("touchstart", a);
        a = function (a) {
            for (var d = !1, e = 0; e < a.changedTouches.length; ++e) {
                var f = a.changedTouches[e],
                    g = this.touches[f.identifier];
                if (g) {
                    if (this.tapPossible) {
                        var h = this.element.getBoundingClientRect(),
                            d = f.clientX - h.left,
                            h = f.clientY - h.top;
                        if (24 > Math.max(Math.abs(d - g.startX), Math.abs(h - g.startY))) {
                            for (e = 0; e < this.onTap.length; ++e) this.onTap[e](d, h);
                            this.needSingleTap = !0;
                            window.setTimeout(function (a, b) {
                                if (this.needSingleTap) {
                                    for (var c = 0; c < this.onSingleTap.length; ++c) this.onSingleTap[c](a, b);
                                    this.needSingleTap = !1
                                }
                            }.bind(this, d, h), 501);
                            g = !1;
                            if (void 0 !== this.doubleTapTimer) {
                                var k = 24 > Math.max(Math.abs(d - this.lastTapPos[0]), Math.abs(h - this.lastTapPos[1])),
                                    l = 500 > Date.now() - this.doubleTapTimer;
                                if (k && l)
                                    for (g = !0, e = 0; e < this.onDoubleTap.length; ++e) this.onDoubleTap[e](d, h)
                            }
                            this.doubleTapTimer = Date.now();
                            g && (this.doubleTapTimer = -1E9);
                            this.lastTapPos[0] = d;
                            this.lastTapPos[1] = h
                        }
                        this.tapPossible = !1
                    }
                    delete this.touches[f.identifier];
                    d = !0
                }
            }
            for (f = e = 0; f < this.touches.length; ++f) e++;
            0 >= e && (this.touchCountFloor = 0);
            d && b(a)
        }.bind(this);
        this.element.addEventListener("touchend", a);
        this.element.addEventListener("touchcancel", a);
        this.element.addEventListener("touchleave", a);
        a = function (a) {
            for (var d = [], e = 0; e < a.touches.length; ++e) a.touches[e].target ===
                this.element && d.push(a.touches[e]);
            var f = this.element.getBoundingClientRect();
            if (1 == d.length && 1 >= this.touchCountFloor) {
                var g = d[0],
                    h = this.touches[g.identifier];
                if (h) {
                    var k = g.clientX - f.left,
                        g = g.clientY - f.top,
                        f = k - h.x,
                        l = g - h.y;
                    h.x = k;
                    h.y = g;
                    for (e = 0; e < this.onDrag.length; ++e) this.onDrag[e](k, g, f, l, a.shiftKey)
                }
            } else if (2 == d.length && 2 >= this.touchCountFloor) {
                if (l = d[0], e = this.touches[l.identifier], g = d[1], h = this.touches[g.identifier], e && h) {
                    var k = l.clientX - f.left,
                        l = l.clientY - f.top,
                        n = g.clientX - f.left,
                        m = g.clientY -
                        f.top,
                        p = Math.sqrt((k - n) * (k - n) + (l - m) * (l - m)),
                        r = Math.sqrt((e.x - h.x) * (e.x - h.x) + (e.y - h.y) * (e.y - h.y)),
                        s = Math.abs(p - r),
                        f = (k - e.x + n - h.x) / 2,
                        g = (l - e.y + m - h.y) / 2,
                        u = Math.sqrt(f * f + g * g);
                    e.x = k;
                    e.y = l;
                    h.x = n;
                    h.y = m;
                    if (0 < s)
                        for (h = s / (s + u), e = 0; e < this.onZoom.length; ++e) this.onZoom[e](2 * (p - r) * h);
                    if (0 < u)
                        for (h = u / (s + u), e = 0; e < this.onDrag.length; ++e) this.onPan[e](f * h, g * h)
                }
            } else if (3 <= d.length) {
                for (e = r = p = n = l = 0; e < d.length; ++e) g = d[e], h = this.touches[g.identifier], k = g.clientX - f.left, g = g.clientY - f.top, p += k, r += g, h && (l += h.x, n += h.y, h.x = k,
                    h.y = g);
                l /= d.length;
                n /= d.length;
                p /= d.length;
                r /= d.length;
                for (e = 0; e < this.onPan2.length; ++e) this.onPan2[e](p - l, r - n)
            }
            0 < d.length && b(a)
        }.bind(this);
        this.element.addEventListener("touchmove", a)
    };

    function KeyFrame(a, b) {
        a && b ? (this.frameIndex = b.frameIndex, this.value = b.value, this.interpolation = b.interpolation, this.weighIn = b.weighIn, this.weighOut = b.weighOut) : (this.interpolation = this.value = this.frameIndex = 0, this.weighOut = this.weighIn = 1)
    };

    function Lights(a, b) {
        this.rotation = this.shadowCount = this.count = 0;
        this.positions = [];
        this.directions = [];
        this.matrixWeights = [];
        this.matrix = Matrix.identity();
        this.invMatrix = Matrix.identity();
        this.defaultmatrix = Matrix.identity();
        this.defaultviewmatrix = Matrix.identity();
        for (var c in a) this[c] = a[c];
        this.count = this.positions.length / 4;
        this.count = Math.min(6, this.count);
        this.shadowCount = Math.min(3, this.shadowCount);
        this.positions = new Float32Array(this.positions);
        this.positionBuffer = new Float32Array(this.positions);
        this.directions = new Float32Array(this.directions);
        this.directionBuffer = new Float32Array(this.directions);
        this.colors = new Float32Array(this.colors);
        this.colorsBuffer = new Float32Array(this.colors);
        this.modelViewBuffer = new Float32Array(16 * this.shadowCount);
        this.projectionBuffer = new Float32Array(16 * this.shadowCount);
        this.finalTransformBuffer = new Float32Array(16 * this.shadowCount);
        this.inverseTransformBuffer = new Float32Array(16 * this.shadowCount);
        this.shadowTexelPadProjections = new Float32Array(4 * this.shadowCount);
        this.shadowsNeedUpdate = new Uint8Array(this.shadowCount);
        for (var d = 0; d < this.shadowsNeedUpdate.length; ++d) this.shadowsNeedUpdate[d] = 1;
        Matrix.rotation(this.matrix, this.rotation, 1);
        Matrix.transpose(this.invMatrix, this.matrix);
        Matrix.copy(this.defaultmatrix, this.matrix);
        Matrix.copy(this.defaultviewmatrix, b.viewMatrix);
        for (d = 0; d < this.count; ++d) {
            c = this.positions.subarray(4 * d, 4 * d + 4);
            var e = this.directions.subarray(3 * d, 3 * d + 3);
            1 == this.matrixWeights[d] ? (Matrix.mul4(c, this.matrix, c[0], c[1], c[2], c[3]), Matrix.mulVec(e,
                this.matrix, e[0], e[1], e[2])) : 2 == this.matrixWeights[d] && (Matrix.mul4(c, b.viewMatrix, c[0], c[1], c[2], c[3]), Matrix.mulVec(e, b.viewMatrix, e[0], e[1], e[2]))
        }
    }
    Lights.prototype.getLightPos = function (a) {
        return this.positionBuffer.subarray(4 * a, 4 * a + 4)
    };
    Lights.prototype.setLightDistance = function (a, b) {
        0 >= b && (b = 1E-5);
        this.parameters[3 * a + 2] = 1 / b
    };
    Lights.prototype.setLightSpotAngle = function (a, b) {
        0 >= b && (b = 1E-6);
        this.spot[3 * a] = b;
        var c = Math.sin(3.1415926 / 180 * b / 2);
        this.spot[3 * a + 2] = 1 / (c * c) * this.spot[3 * a + 1]
    };
    Lights.prototype.setLightSpotSharpness = function (a, b) {
        this.spot[3 * a + 1] = b;
        this.setLightSpotAngle(this.spot[3 * a])
    };
    Lights.prototype.setLightPos = function (a, b) {
        this.positions[4 * a + 0] = b[0];
        this.positions[4 * a + 1] = b[1];
        this.positions[4 * a + 2] = b[2];
        var c = this.positions.subarray(4 * a, 4 * a + 4);
        1 == this.matrixWeights[a] ? Matrix.mul4(c, this.defaultmatrix, b[0], b[1], b[2], c[3]) : 2 == this.matrixWeights[a] && Matrix.mul4(c, this.defaultviewmatrix, b[0], b[1], b[2], c[3])
    };
    Lights.prototype.setLightDir = function (a, b) {
        this.directions[3 * a + 0] = b[0];
        this.directions[3 * a + 1] = b[1];
        this.directions[3 * a + 2] = b[2];
        var c = this.directions.subarray(3 * a, 3 * a + 3);
        1 == this.matrixWeights[a] ? Matrix.mulVec(c, this.defaultmatrix, b[0], b[1], b[2]) : 2 == this.matrixWeights[a] && Matrix.mulVec(c, this.defaultviewmatrix, b[0], b[1], b[2])
    };
    Lights.prototype.getLightColor = function (a) {
        return this.colors.subarray(3 * a, 3 * a + 3)
    };
    Lights.prototype.setLightColor = function (a, b) {
        this.colors[3 * a + 0] = b[0];
        this.colors[3 * a + 1] = b[1];
        this.colors[3 * a + 2] = b[2]
    };
    Lights.prototype.getLightDir = function (a) {
        return this.directionBuffer.subarray(3 * a, 3 * a + 3)
    };
    Lights.prototype.getColor = function (a) {
        a *= 3;
        return [this.colors[a], this.colors[a + 1], this.colors[a + 2]]
    };
    Lights.prototype.update = function (a, b) {
        var c = new Matrix.type(this.matrix);
        Matrix.rotation(this.matrix, this.rotation, 1);
        Matrix.transpose(this.invMatrix, this.matrix);
        for (var d = 0; d < this.count; ++d) {
            var e = this.positions.subarray(4 * d, 4 * d + 4),
                f = this.directions.subarray(3 * d, 3 * d + 3),
                g = this.getLightPos(d),
                h = this.getLightDir(d);
            1 == this.matrixWeights[d] ? (g[0] = e[0], g[1] = e[1], g[2] = e[2], g[3] = e[3], h[0] = f[0], h[1] = f[1], h[2] = f[2]) : 2 == this.matrixWeights[d] ? (Matrix.mul4(g, a.transform, e[0], e[1], e[2], e[3]), Matrix.mulVec(h,
                a.transform, f[0], f[1], f[2]), Matrix.mul4(g, this.matrix, g[0], g[1], g[2], g[3]), Matrix.mulVec(h, this.matrix, h[0], h[1], h[2])) : (Matrix.mul4(g, this.matrix, e[0], e[1], e[2], e[3]), Matrix.mulVec(h, this.matrix, f[0], f[1], f[2]));
            Vect.normalize(h, h)
        }
        for (var f = new Float32Array(this.finalTransformBuffer), g = Matrix.empty(), h = Matrix.empty(), k = Matrix.empty(), l = Vect.empty(), n = Vect.empty(), m = Vect.empty(), p = Vect.empty(), e = Vect.empty(), r = [], s = [], u = Matrix.create(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), d = 0; d < this.count; ++d) {
            l =
                this.getLightPos(d);
            n = this.getLightDir(d);
            0.99 < Math.abs(n[1]) ? Vect.set(m, 1, 0, 0) : Vect.set(m, 0, 1, 0);
            Vect.cross(p, m, n);
            Vect.normalize(p, p);
            Vect.cross(m, n, p);
            Vect.normalize(m, m);
            Matrix.set(g, p[0], p[1], p[2], -Vect.dot(p, l), m[0], m[1], m[2], -Vect.dot(m, l), n[0], n[1], n[2], -Vect.dot(n, l), 0, 0, 0, 1);
            for (l = 0; 8 > l; ++l) e[0] = l & 1 ? b.max[0] : b.min[0], e[1] = l & 2 ? b.max[1] : b.min[1], e[2] = l & 4 ? b.max[2] : b.min[2], Matrix.mulPoint(e, this.matrix, 1.005 * e[0], 1.005 * e[1], 1.005 * e[2]), Matrix.mulPoint(e, g, e[0], e[1], e[2]), 0 == l ? (r[0] = s[0] = e[0],
                r[1] = s[1] = e[1], r[2] = s[2] = e[2]) : (r[0] = Math.min(r[0], e[0]), r[1] = Math.min(r[1], e[1]), r[2] = Math.min(r[2], e[2]), s[0] = Math.max(s[0], e[0]), s[1] = Math.max(s[1], e[1]), s[2] = Math.max(s[2], e[2]));
            var l = -r[2],
                n = -s[2],
                q = this.spot[3 * d];
            0 < q ? (l = Math.min(l, 1 / this.parameters[3 * d + 2]), n = Math.max(0.04 * l, n), Matrix.perspective(h, q, 1, n, l), d < this.shadowCount && (l = 2 * -Math.tan(0.00872664625 * q), this.shadowTexelPadProjections[4 * d + 0] = this.modelViewBuffer[16 * d + 2] * l, this.shadowTexelPadProjections[4 * d + 1] = this.modelViewBuffer[16 * d + 6] *
                l, this.shadowTexelPadProjections[4 * d + 2] = this.modelViewBuffer[16 * d + 10] * l, this.shadowTexelPadProjections[4 * d + 3] = this.modelViewBuffer[16 * d + 14] * l)) : (Matrix.ortho(h, r[0], s[0], r[1], s[1], n, l), d < this.shadowCount && (this.shadowTexelPadProjections[4 * d + 0] = this.shadowTexelPadProjections[4 * d + 1] = this.shadowTexelPadProjections[4 * d + 2] = 0, this.shadowTexelPadProjections[4 * d + 3] = Math.max(s[0] - r[0], s[1] - r[1])));
            Matrix.mul(k, h, g);
            Matrix.mul(k, u, k);
            Matrix.copyToBuffer(this.modelViewBuffer, 16 * d, g);
            Matrix.copyToBuffer(this.projectionBuffer,
                16 * d, h);
            Matrix.copyToBuffer(this.finalTransformBuffer, 16 * d, k);
            Matrix.invert(k, k);
            Matrix.copyToBuffer(this.inverseTransformBuffer, 16 * d, k)
        }
        e = !1;
        for (d = 0; d < c.length; ++d)
            if (c[d] != this.matrix[d]) {
                e = !0;
                break
            } for (d = 0; d < this.shadowCount; d++)
            if (e && 1 == this.matrixWeights[d]) this.shadowsNeedUpdate[d] = 1;
            else
                for (c = 16 * d; c < 16 * d + 16; ++c)
                    if (f[c] != this.finalTransformBuffer[c]) {
                        this.shadowsNeedUpdate[d] = 1;
                        break
                    }
    };
    Lights.prototype.flagUpdateAnimatedLighting = function () {
        for (var a = 0; a < this.shadowCount; a++) this.shadowsNeedUpdate[a] = 1
    };

    function ListBox(a) {
        this.name = "none";
        this.text = "default text";
        this.title = "none";
        this.debugString = this.imagePath = "";
        this.controlRect = new ControlRect(a);
        this.textEntries = [];
        this.textOffsetsX = [];
        this.textOffsetsY = [];
        this.buttons = [];
        this.listBoxEntryHeight = 20;
        this.selectedItemText = "";
        this.selectedIndex = -1;
        this.localPixelsY = 0;
        this.localPixelsX = 100;
        this.labelPixelDrop = 0;
        this.labelPixelInset = 10;
        this.labelTextHeight = 16;
        this.closed = !1;
        this.defaultButtonText = this.spacerMiddle = this.spacerRight = this.spacerLeft =
            this.spacerControl = 0;
        this.listBoxButtons = [];
        this.listBoxRegion = new GUIRegion(a);
        this.guiScreen = a;
        this.lastMouseOverIndex = -1;
        this.selectionChangedCallback = 0;
        this.debugString = ""
    }
    ListBox.prototype.linkControl = function (a) {
        this.controlRect.linkControl(a)
    };
    ListBox.prototype.spawnControl = function (a, b, c, d, e, f) {
        var g = this.guiScreen.imageSetNumber,
            h = "backgroundTopLE" + g + "x.png",
            k = "backgroundTopM" + g + "x.png",
            l = "backgroundTopRE" + g + "x.png",
            n = "backgroundMiddleLE" + g + "x.png",
            m = "backgroundMiddleM" + g + "x.png",
            p = "backgroundMiddleRE" + g + "x.png",
            r = "backgroundBottomLE" + g + "x.png",
            s = "backgroundBottomM" + g + "x.png",
            u = "backgroundBottomRE" + g + "x.png",
            q = 3 * g,
            x = "backgroundLE" + g + "x.png",
            w = "backgroundM" + g + "x.png",
            v = "backgroundRE" + g + "x.png",
            t = 2 * g,
            y = "spacerLE" + g + "x.png",
            E = "spacerM" +
            g + "x.png",
            F = "spacerRE" + g + "x.png",
            g = 2 * g,
            A = this.controlRect.guiScreen.width,
            B = this.controlRect.guiScreen.height;
        if (e) {
            e = this.textEntries.length;
            var z = c;
            for (c = 0; c < e; c++) {
                var C = 8 * (this.textEntries[c] ? this.textEntries[c].length : 0);
                z < C && (z = C)
            }
            c = z + f
        }
        e = this.textEntries.length + 1;
        f = 1 / e;
        this.localPixelsX = c;
        this.listBoxEntryHeight = d;
        this.localPixelsY = (this.textEntries.length + 1) * this.listBoxEntryHeight;
        c = 8 / this.localPixelsY;
        d = 6 / this.localPixelsX;
        z = 4 / this.localPixelsX;
        C = f - c / 4;
        this.labelTextHeight = marmoset.largeUI ?
            20 : 16;
        this.labelPixelDrop = (this.listBoxEntryHeight - this.labelTextHeight) / 2;
        this.listBoxRegion.controlRect.widthPercent = this.localPixelsX / A;
        this.listBoxRegion.controlRect.heightPercent = this.localPixelsY / B;
        this.listBoxRegion.controlRect.xPercent = a / A;
        this.listBoxRegion.controlRect.yPercent = b / B;
        this.openBackground = this.listBoxRegion.addTextButton("", 0, 0, 1, 1 + c, 1);
        this.openBackground.setBackground3x3(this.listBoxRegion, 0, 0, h, k, l, n, m, p, r, s, u, q, q);
        this.closedBackground = this.listBoxRegion.addTextButton("",
            0, 0, 1, f, 1);
        this.closedBackground.setBackground3x1(this.listBoxRegion, 0, 0, x, w, v, t);
        a = this.labelPixelInset + this.textOffsetsX[0];
        b = this.labelPixelDrop + this.textOffsetsY[0];
        b /= this.localPixelsY;
        a /= this.localPixelsX;
        this.defaultButton = this.listBoxRegion.addTextButton("Selected", a, -b, 1, f, 0.5);
        this.selectedIndex = 0;
        this.defaultButton.controlRect.linkedControl.innerHTML = this.textEntries[this.selectedIndex];
        this.defaultButton.linkedBackground = this.closedBackground;
        this.spacerControl = this.listBoxRegion.addTextButton("",
            d, C, 1 - (d + z), c, 1);
        this.spacerControl.defaultAlpha = 1;
        this.spacerControl.setBackground3x1(this.listBoxRegion, 0, 0, y, E, F, g);
        this.spacerControl.setVisible(!1);
        this.spacerControl.linkedBackground = this.openBackground;
        for (c = 1; c < e; c++) a = this.labelPixelInset + this.textOffsetsX[c - 1], b = this.labelPixelDrop + this.textOffsetsY[c - 1] - 4, a /= this.localPixelsX, b /= this.localPixelsY, y = this.listBoxRegion.addTextButton(this.textEntries[c - 1], a, f * c - b, 1 - a, f, 0.5), this.listBoxButtons.push(y), y.linkedBackground = this.openBackground;
        this.showList(!1);
        this.setupCallbacks()
    };
    ListBox.prototype.setControl = function (a, b, c, d, e, f) {
        var g = this.controlRect.guiScreen.width,
            h = this.controlRect.guiScreen.height;
        if (e) {
            e = this.textEntries.length;
            for (var k = 0; k < e; k++) {
                var l = 8 * (this.textEntries[k] ? this.textEntries[k].length : 0);
                c < l && (c = l)
            }
            c += f
        }
        this.localPixelsX = c;
        this.listBoxEntryHeight = d;
        this.localPixelsY = (this.textEntries.length + 1) * this.listBoxEntryHeight;
        this.listBoxRegion.controlRect.widthPercent = this.localPixelsX / g;
        this.listBoxRegion.controlRect.heightPercent = this.localPixelsY / h;
        this.listBoxRegion.controlRect.xPercent =
            a / g;
        this.listBoxRegion.controlRect.yPercent = b / h;
        this.listBoxRegion.controlRect.updateChildElements();
        this.spacerControl.alignBackground();
        this.openBackground.alignBackground();
        this.closedBackground.alignBackground()
    };
    ListBox.prototype.addItem = function (a, b, c) {
        this.textEntries.push(a);
        this.textOffsetsX.push(b);
        this.textOffsetsY.push(c)
    };
    ListBox.prototype.showList = function (a) {
        for (var b = this.listBoxButtons.length, c = 0; c < b; c++) this.listBoxButtons[c].setVisible(a);
        this.closed = !a;
        this.spacerControl && this.spacerControl.setVisible(a);
        this.openBackground && this.openBackground.setVisible(a);
        this.closedBackground && this.closedBackground.setVisible(!a);
        a ? (this.defaultButton.linkedBackground = this.openBackground, this.openBackground.setOpacity(1), this.closedBackground.setOpacity(0.5)) : this.defaultButton.linkedBackground = this.closedBackground
    };
    ListBox.prototype.selectItem = function (a) {
        this.selectedItemText = this.textEntries[a];
        this.selectedIndex = a;
        this.defaultButton.controlRect.linkedControl.innerHTML = this.textEntries[this.selectedIndex];
        a = (this.labelTextHeight - this.listBoxEntryHeight + 3) / this.localPixelsY;
        this.defaultButton.controlRect.xPercent = (this.labelPixelInset + this.textOffsetsX[this.selectedIndex]) / this.localPixelsX;
        this.defaultButton.controlRect.yPercent = a;
        this.defaultButton.controlRect.updateElement()
    };
    ListBox.prototype.setupCallbacks = function () {
        var a = function (a) {
            if (this.closed) {
                var b = this.closedBackground.controlRect.linkedControl,
                    b = b.getBoundingClientRect(),
                    c = a.clientX - b.left;
                a = a.clientY - b.top;
                c /= b.width;
                b = a / b.height;
                0 <= c && 1 >= c && 0 <= b && 1 >= b ? this.closedBackground.setOpacity(1) : this.closedBackground.setOpacity(0.5)
            } else b = this.openBackground.controlRect.linkedControl, b = b.getBoundingClientRect(), c = a.clientX - b.left, a = a.clientY - b.top, c /= b.width, b = a / b.height, 0 <= c && 1 >= c && 0 <= b && 1 >= b ? this.openBackground.setOpacity(1) :
                this.openBackground.setOpacity(0.5)
        }.bind(this);
        this.defaultButton.controlRect.linkedControl.onclick = function () {
            this.closed ? this.showList(!0) : (this.showList(this.closed), this.closedBackground.setOpacity(1), this.defaultButton.setOpacity(1))
        }.bind(this);
        for (var b = function (a) {
                this.selectItem(a.id);
                this.showList(!1);
                this.defaultButton.setOpacity(0.5);
                this.selectionChangedCallback && this.selectionChangedCallback(this)
            }.bind(this), c = function (a) {
                a = this.listBoxButtons.length;
                for (var b = 0; b < a; b++) this.listBoxButtons[b].controlRect.mouseOver &&
                    (this.selectItem(b), b = a, this.selectionChangedCallback && this.selectionChangedCallback(this));
                this.showList(!1)
            }.bind(this), d = this.listBoxButtons.length, e = 0; e < d; e++) this.listBoxButtons[e].controlRect.callBack = b, this.listBoxButtons[e].controlRect.id = e, this.listBoxButtons[e].controlRect.linkedControl.addEventListener("mousemove", a);
        this.guiScreen.ui.viewer.input.element.addEventListener("mousemove", a);
        this.openBackground.controlRect.linkedControl.addEventListener("mousemove", a);
        this.closedBackground.controlRect.linkedControl.addEventListener("mousemove",
            a);
        this.guiScreen.ui.viewer.input.element.addEventListener("mousedown", c)
    };

    function Material(a, b, c) {
        this.gl = a;
        this.name = c.name;
        var d = {
                mipmap: !0,
                aniso: a.hints.mobile ? 0 : 4,
                clamp: !!c.textureWrapClamp,
                mirror: !!c.textureWrapMirror
            },
            e = {
                mipmap: d.mipmap,
                clamp: d.clamp,
                mirror: d.mirror,
                nofilter: c.textureFilterNearest || !1
            };
        e.nofilter || (e.aniso = a.hints.mobile ? 2 : 4);
        this.textures = {
            albedo: a.textureCache.fromFilesMergeAlpha(b.get(c.albedoTex), b.get(c.alphaTex), e),
            reflectivity: a.textureCache.fromFilesMergeAlpha(b.get(c.reflectivityTex), b.get(c.glossTex), d),
            normal: a.textureCache.fromFile(b.get(c.normalTex),
                d),
            extras: a.textureCache.fromFilesMergeAlpha(b.get(c.extrasTex), b.get(c.extrasTexA), d)
        };
        this.extrasTexCoordRanges = {};
        if (c.extrasTexCoordRanges)
            for (var f in c.extrasTexCoordRanges) this.extrasTexCoordRanges[f] = new Float32Array(c.extrasTexCoordRanges[f].scaleBias);
        this.textures.extras || (b = new Texture(a, {
            width: 1,
            height: 1
        }), b.loadArray(new Uint8Array([255, 255, 255, 255])), this.textures.extras = b);
        var g = c.blendTint || [1, 1, 1];
        b = {
            none: function () {
                a.disable(a.BLEND)
            },
            alpha: function () {
                a.enable(a.BLEND);
                a.blendFuncSeparate(a.SRC_ALPHA,
                    a.ONE_MINUS_SRC_ALPHA, a.ONE_MINUS_DST_ALPHA, a.ONE)
            },
            add: function () {
                a.enable(a.BLEND);
                a.blendColor(g[0], g[1], g[2], 1);
                a.blendFunc(a.ONE, a.CONSTANT_COLOR)
            }
        };
        this.blend = b[c.blend] || b.none;
        this.alphaTest = c.alphaTest || 0;
        this.usesBlending = this.blend !== b.none;
        this.usesRefraction = !!c.refraction;
        this.shadowAlphaTest = this.alphaTest;
        0 >= this.shadowAlphaTest && this.blend === b.alpha && (this.shadowAlphaTest = 0.5);
        this.castShadows = this.blend !== b.add;
        this.horizonOcclude = c.horizonOcclude || 0;
        this.fresnel = new Float32Array(c.fresnel ?
            c.fresnel : [1, 1, 1]);
        this.emissiveIntensity = c.emissiveIntensity || 1;
        d = [];
        e = !1;
        0 < c.lightCount && d.push("#define LIGHT_COUNT " + c.lightCount);
        0 < c.shadowCount && (f = Math.min(c.lightCount, c.shadowCount), this.usesRefraction && 8 >= a.limits.textureCount && (f = 2 < f ? 2 : f), d.push("#define SHADOW_COUNT " + f));
        0 < c.alphaTest && d.push("#define ALPHA_TEST");
        this.blend === b.alpha ? d.push("#define TRANSPARENCY_DITHER") : this.blend === b.none && d.push("#define NOBLEND");
        a.hints.mobile && d.push("#define MOBILE");
        a.ext.textureDepth && d.push("#define SHADOW_NATIVE_DEPTH");
        f = function (a) {
            return 1 / (2 / 3 * 3.1415962 * (a * a + a + 1))
        };
        c.useSkin && (d.push("#define SKIN"), this.skinParams = c.skinParams || {
                subdermisColor: [1, 1, 1],
                transColor: [1, 0, 0, 1],
                fresnelColor: [0.2, 0.2, 0.2, 0.5],
                fresnelOcc: 1,
                fresnelGlossMask: 1,
                transSky: 0.5,
                shadowBlur: 0.5,
                normalSmooth: 0.5,
                transScatter: 0,
                transDepth: 0,
                millimeterScale: 1
            }, this.extrasTexCoordRanges.subdermisTex || d.push("#define SKIN_NO_SUBDERMIS_TEX"), this.extrasTexCoordRanges.translucencyTex || d.push("#define SKIN_NO_TRANSLUCENCY_TEX"), this.extrasTexCoordRanges.fuzzTex ||
            d.push("#define SKIN_NO_FUZZ_TEX"), void 0 === this.skinParams.version && (this.skinParams.version = 1), 2 == this.skinParams.version ? (d.push("#define SKIN_VERSION_2"), this.skinParams.shadowBlur *= 4, this.skinParams.shadowBlur = Math.min(this.skinParams.shadowBlur, 40), this.skinParams.transIntegral = f(0.5 * this.skinParams.transScatter), this.skinParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.skinParams.fresnelColor[3]), this.skinParams.transSky = 0) : (d.push("#define SKIN_VERSION_1"), this.skinParams.shadowBlur = 8 * Math.min(this.skinParams.shadowBlur,
                1), this.skinParams.transDepth = 0, this.skinParams.transScatter = this.skinParams.transColor[3], this.skinParams.transIntegral = 1 / 3.14159 * (1 - 0.5 * this.skinParams.transScatter), this.skinParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.skinParams.fresnelColor[3]), this.skinParams.transSky *= 1.25, this.skinParams.transIntegral *= 1.25));
        c.aniso && (d.push("#define ANISO"), this.anisoParams = c.anisoParams || {
            strength: 1,
            tangent: [1, 0, 0],
            integral: 0.5
        }, this.extrasTexCoordRanges.anisoTex || d.push("#define ANISO_NO_DIR_TEX"));
        c.microfiber &&
            (d.push("#define MICROFIBER"), this.microfiberParams = c.microfiberParams || {
                fresnelColor: [0.2, 0.2, 0.2, 0.5],
                fresnelOcc: 1,
                fresnelGlossMask: 1
            }, this.microfiberParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.microfiberParams.fresnelColor[3]), this.extrasTexCoordRanges.fuzzTex || d.push("#define MICROFIBER_NO_FUZZ_TEX"));
        c.refraction && (d.push("#define REFRACTION"), this.refractionParams = c.refractionParams || {
            distantBackground: !1,
            tint: [1, 1, 1],
            useAlbedoTint: !1,
            IOR: 1.5
        }, this.extrasTexCoordRanges.refractionMaskTex || d.push("#define REFRACTION_NO_MASK_TEX"));
        c.vertexColor && (d.push("#define VERTEX_COLOR"), c.vertexColorsRGB && d.push("#define VERTEX_COLOR_SRGB"), c.vertexColorAlpha && d.push("#define VERTEX_COLOR_ALPHA"));
        this.horizonSmoothing = c.horizonSmoothing || 0;
        0 < this.horizonSmoothing && d.push("#define HORIZON_SMOOTHING");
        c.unlitDiffuse && d.push("#define DIFFUSE_UNLIT");
        this.extrasTexCoordRanges.emissiveTex && (d.push("#define EMISSIVE"), c.emissiveSecondaryUV && (d.push("#define EMISSIVE_SECONDARY_UV"), e = !0));
        this.extrasTexCoordRanges.aoTex && (d.push("#define AMBIENT_OCCLUSION"),
            c.aoSecondaryUV && (d.push("#define AMBIENT_OCCLUSION_SECONDARY_UV"), e = !0));
        c.tangentOrthogonalize && d.push("#define TSPACE_ORTHOGONALIZE");
        c.tangentNormalize && d.push("#define TSPACE_RENORMALIZE");
        c.tangentGenerateBitangent && d.push("#define TSPACE_COMPUTE_BITANGENT");
        e && d.push("#define TEXCOORD_SECONDARY");
        this.vOffset = this.uOffset = 0;
        d.push("#define UV_OFFSET ");
        this.shader = a.shaderCache.fromURLs("matvert.glsl", "matfrag.glsl", d);
        d.push("#define STRIPVIEW");
        this.stripShader = a.shaderCache.fromURLs("matvert.glsl",
            "matfrag.glsl", d);
        this.wireShader = a.shaderCache.fromURLs("wirevert.glsl", "wirefrag.glsl");
        this.blend === b.alpha && (this.prepassShader = a.shaderCache.fromURLs("alphaprepassvert.glsl", "alphaprepassfrag.glsl"))
    }
    Material.prototype.bind = function (a, b) {
        if (!this.complete()) return !1;
        var c = a.view,
            d = a.lights,
            e = a.sky,
            f = a.shadow,
            g = a.stripData.active() ? this.stripShader : this.shader,
            h = this.skinParams,
            k = this.anisoParams,
            l = this.microfiberParams,
            n, m = this.gl,
            p = g.params,
            r = this.textures,
            s = g.samplers;
        g.bind();
        this.blend();
        var u = b.mesh.displayMatrix,
            q = Matrix.mul(Matrix.empty(), c.viewMatrix, u),
            x = Matrix.mul(Matrix.empty(), c.projectionMatrix, c.viewMatrix),
            q = Matrix.mul(Matrix.empty(), c.projectionMatrix, q),
            u = Matrix.mul(Matrix.empty(),
                d.matrix, u);
        m.uniformMatrix4fv(p.uModelViewProjectionMatrix, !1, q);
        m.uniformMatrix4fv(p.uSkyMatrix, !1, u);
        u = Matrix.mulPoint(Vect.empty(), d.matrix, c.transform[12], c.transform[13], c.transform[14]);
        m.uniform3f(p.uCameraPosition, u[0], u[1], u[2]);
        m.uniform3fv(p.uFresnel, this.fresnel);
        m.uniform1f(p.uAlphaTest, this.alphaTest);
        m.uniform1f(p.uHorizonOcclude, this.horizonOcclude);
        m.uniform1f(p.uHorizonSmoothing, this.horizonSmoothing);
        m.uniform4fv(p.uDiffuseCoefficients, e.diffuseCoefficients);
        0 < d.count && (m.uniform4fv(p.uLightPositions,
            d.positionBuffer), m.uniform3fv(p.uLightDirections, d.directionBuffer), m.uniform3fv(p.uLightColors, d.colors), m.uniform3fv(p.uLightParams, d.parameters), m.uniform3fv(p.uLightSpot, d.spot), u = 0.392699 * a.postRender.currentSample(), m.uniform2f(p.uShadowKernelRotation, 0.5 * Math.cos(u), 0.5 * Math.sin(u)), 0 < d.shadowCount && (u = f.depthTextures[0].desc.width, m.uniform2f(p.uShadowMapSize, u, 1 / u), m.uniformMatrix4fv(p.uShadowMatrices, !1, d.finalTransformBuffer), m.uniformMatrix4fv(p.uInvShadowMatrices, !1, d.inverseTransformBuffer),
            m.uniform4fv(p.uShadowTexelPadProjections, d.shadowTexelPadProjections), f.bindDepthTexture(s.tDepth0, 0), f.bindDepthTexture(s.tDepth1, 1), f.bindDepthTexture(s.tDepth2, 2)));
        h && (m.uniform3fv(p.uSubdermisColor, h.subdermisColor), m.uniform4fv(p.uTransColor, h.transColor), m.uniform1f(p.uTransScatter, h.transScatter), m.uniform4fv(p.uFresnelColor, h.fresnelColor), m.uniform1f(p.uFresnelOcc, h.fresnelOcc), m.uniform1f(p.uFresnelGlossMask, h.fresnelGlossMask), m.uniform1f(p.uFresnelIntegral, h.fresnelIntegral), m.uniform1f(p.uTransIntegral,
            h.transIntegral), m.uniform1f(p.uSkinTransDepth, h.transDepth), m.uniform1f(p.uTransSky, h.transSky), m.uniform1f(p.uSkinShadowBlur, h.shadowBlur), m.uniform1f(p.uNormalSmooth, h.normalSmooth), (n = this.extrasTexCoordRanges.subdermisTex) && m.uniform4fv(p.uTexRangeSubdermis, n), (n = this.extrasTexCoordRanges.translucencyTex) && m.uniform4fv(p.uTexRangeTranslucency, n), (n = this.extrasTexCoordRanges.fuzzTex) && m.uniform4fv(p.uTexRangeFuzz, n));
        l && (m.uniform4fv(p.uFresnelColor, l.fresnelColor), m.uniform1f(p.uFresnelOcc, l.fresnelOcc),
            m.uniform1f(p.uFresnelGlossMask, l.fresnelGlossMask), m.uniform1f(p.uFresnelIntegral, l.fresnelIntegral), (n = this.extrasTexCoordRanges.fuzzTex) && m.uniform4fv(p.uTexRangeFuzz, n));
        k && (m.uniform3fv(p.uAnisoTangent, k.tangent), m.uniform1f(p.uAnisoStrength, k.strength), m.uniform1f(p.uAnisoIntegral, k.integral), (n = this.extrasTexCoordRanges.anisoTex) && m.uniform4fv(p.uTexRangeAniso, n));
        this.usesRefraction && (a.refractionSurface && a.refractionSurface.bind(s.tRefraction), d = Matrix.mul(Matrix.empty(), x, d.invMatrix), m.uniformMatrix4fv(p.uRefractionViewProjection,
            !1, d), m.uniform1f(p.uRefractionRayDistance, this.refractionParams.distantBackground ? 1E10 : 4 * b.mesh.bounds.maxExtent), m.uniform3fv(p.uRefractionTint, this.refractionParams.tint), m.uniform1f(p.uRefractionAlbedoTint, this.refractionParams.useAlbedoTint ? 1 : 0), m.uniform1f(p.uRefractionIOREntry, 1 / this.refractionParams.IOR), (n = this.extrasTexCoordRanges.refractionMaskTex) && m.uniform4fv(p.uTexRangeRefraction, n));
        if (n = this.extrasTexCoordRanges.emissiveTex) m.uniform4fv(p.uTexRangeEmissive, n), m.uniform1f(p.uEmissiveScale,
            this.emissiveIntensity);
        (n = this.extrasTexCoordRanges.aoTex) && m.uniform4fv(p.uTexRangeAO, n);
        r.albedo.bind(s.tAlbedo);
        r.reflectivity.bind(s.tReflectivity);
        r.normal.bind(s.tNormal);
        r.extras.bind(s.tExtras);
        e.specularTexture.bind(s.tSkySpecular);
        g === this.stripShader && (m.uniform1fv(p.uStrips, a.stripData.strips), m.uniform2f(p.uStripRes, 2 / c.size[0], 2 / c.size[1]));
        m.uniform2f(p.uUVOffset, this.uOffset, this.vOffset);
        return !0
    };
    Material.prototype.bindAlphaPrepass = function (a, b) {
        if (!this.complete() || !this.prepassShader) return !1;
        var c = this.gl,
            d = this.prepassShader.params,
            e = this.prepassShader.samplers;
        this.prepassShader.bind();
        var f = Matrix.mul(Matrix.empty(), a.view.viewMatrix, b.mesh.displayMatrix),
            f = Matrix.mul(Matrix.empty(), a.view.projectionMatrix, f);
        c.uniformMatrix4fv(d.uModelViewProjectionMatrix, !1, f);
        c.uniform2f(d.uUVOffset, this.uOffset, this.vOffset);
        this.textures.albedo.bind(e.tAlbedo);
        return !0
    };
    Material.prototype.bindWire = function (a, b) {
        if (!this.complete()) return !1;
        var c = this.gl,
            d = this.wireShader.params,
            e = a.view;
        c.enable(c.BLEND);
        c.blendFunc(c.SRC_ALPHA, c.ONE_MINUS_SRC_ALPHA);
        c.depthMask(!1);
        this.wireShader.bind();
        var f = Matrix.mul(Matrix.empty(), a.view.viewMatrix, b.mesh.displayMatrix),
            f = Matrix.mul(Matrix.empty(), a.view.projectionMatrix, f);
        c.uniformMatrix4fv(d.uModelViewProjectionMatrix, !1, f);
        c.uniform4f(d.uStripParams, 2 / e.size[0], 2 / e.size[1], a.stripData.strips[3], a.stripData.strips[4]);
        return !0
    };
    Material.prototype.complete = function () {
        return this.wireShader.complete() && this.shader.complete() && this.stripShader.complete() && (!this.prepassShader || this.prepassShader.complete()) && (!this.refractionShader || this.refractionShader.complete()) && this.textures.albedo.complete() && this.textures.reflectivity.complete() && this.textures.normal.complete()
    };
    var Matrix = {
        type: Float32Array,
        create: function (a, b, c, d, e, f, g, h, k, l, n, m, p, r, s, u) {
            var q = new Matrix.type(16);
            q[0] = a;
            q[4] = b;
            q[8] = c;
            q[12] = d;
            q[1] = e;
            q[5] = f;
            q[9] = g;
            q[13] = h;
            q[2] = k;
            q[6] = l;
            q[10] = n;
            q[14] = m;
            q[3] = p;
            q[7] = r;
            q[11] = s;
            q[15] = u;
            return q
        },
        empty: function () {
            return new Matrix.type(16)
        },
        identity: function () {
            var a = new Matrix.type(16);
            a[0] = 1;
            a[4] = 0;
            a[8] = 0;
            a[12] = 0;
            a[1] = 0;
            a[5] = 1;
            a[9] = 0;
            a[13] = 0;
            a[2] = 0;
            a[6] = 0;
            a[10] = 1;
            a[14] = 0;
            a[3] = 0;
            a[7] = 0;
            a[11] = 0;
            a[15] = 1;
            return a
        },
        set: function (a, b, c, d, e, f, g, h, k, l, n, m, p, r, s, u, q) {
            a[0] =
                b;
            a[4] = c;
            a[8] = d;
            a[12] = e;
            a[1] = f;
            a[5] = g;
            a[9] = h;
            a[13] = k;
            a[2] = l;
            a[6] = n;
            a[10] = m;
            a[14] = p;
            a[3] = r;
            a[7] = s;
            a[11] = u;
            a[15] = q
        },
        translation: function (a, b, c, d) {
            Matrix.set(a, 1, 0, 0, b, 0, 1, 0, c, 0, 0, 1, d, 0, 0, 0, 1);
            return a
        },
        rotation: function (a, b, c) {
            a[0] = 1;
            a[4] = 0;
            a[8] = 0;
            a[12] = 0;
            a[1] = 0;
            a[5] = 1;
            a[9] = 0;
            a[13] = 0;
            a[2] = 0;
            a[6] = 0;
            a[10] = 1;
            a[14] = 0;
            a[3] = 0;
            a[7] = 0;
            a[11] = 0;
            a[15] = 1;
            var d = 0.0174532925 * b;
            b = Math.sin(d);
            d = Math.cos(d);
            switch (c) {
                case 0:
                    a[5] = d;
                    a[9] = -b;
                    a[6] = b;
                    a[10] = d;
                    break;
                case 1:
                    a[0] = d;
                    a[8] = b;
                    a[2] = -b;
                    a[10] = d;
                    break;
                case 2:
                    a[0] = d,
                        a[4] = -b, a[1] = b, a[5] = d
            }
            return a
        },
        mul: function (a, b, c) {
            var d = b[0],
                e = b[1],
                f = b[2],
                g = b[3],
                h = b[4],
                k = b[5],
                l = b[6],
                n = b[7],
                m = b[8],
                p = b[9],
                r = b[10],
                s = b[11],
                u = b[12],
                q = b[13],
                x = b[14];
            b = b[15];
            var w = c[0],
                v = c[1],
                t = c[2],
                y = c[3];
            a[0] = w * d + v * h + t * m + y * u;
            a[1] = w * e + v * k + t * p + y * q;
            a[2] = w * f + v * l + t * r + y * x;
            a[3] = w * g + v * n + t * s + y * b;
            w = c[4];
            v = c[5];
            t = c[6];
            y = c[7];
            a[4] = w * d + v * h + t * m + y * u;
            a[5] = w * e + v * k + t * p + y * q;
            a[6] = w * f + v * l + t * r + y * x;
            a[7] = w * g + v * n + t * s + y * b;
            w = c[8];
            v = c[9];
            t = c[10];
            y = c[11];
            a[8] = w * d + v * h + t * m + y * u;
            a[9] = w * e + v * k + t * p + y * q;
            a[10] = w * f + v * l + t * r + y * x;
            a[11] =
                w * g + v * n + t * s + y * b;
            w = c[12];
            v = c[13];
            t = c[14];
            y = c[15];
            a[12] = w * d + v * h + t * m + y * u;
            a[13] = w * e + v * k + t * p + y * q;
            a[14] = w * f + v * l + t * r + y * x;
            a[15] = w * g + v * n + t * s + y * b;
            return a
        },
        invert: function (a, b) {
            var c = b[0],
                d = b[1],
                e = b[2],
                f = b[3],
                g = b[4],
                h = b[5],
                k = b[6],
                l = b[7],
                n = b[8],
                m = b[9],
                p = b[10],
                r = b[11],
                s = b[12],
                u = b[13],
                q = b[14],
                x = b[15],
                w = c * h - d * g,
                v = c * k - e * g,
                t = c * l - f * g,
                y = d * k - e * h,
                E = d * l - f * h,
                F = e * l - f * k,
                A = n * u - m * s,
                B = n * q - p * s,
                z = n * x - r * s,
                C = m * q - p * u,
                G = m * x - r * u,
                H = p * x - r * q,
                D = w * H - v * G + t * C + y * z - E * B + F * A;
            if (!D) return null;
            D = 1 / D;
            a[0] = (h * H - k * G + l * C) * D;
            a[1] = (e * G - d * H - f * C) * D;
            a[2] = (u * F - q * E + x * y) * D;
            a[3] = (p * E - m * F - r * y) * D;
            a[4] = (k * z - g * H - l * B) * D;
            a[5] = (c * H - e * z + f * B) * D;
            a[6] = (q * t - s * F - x * v) * D;
            a[7] = (n * F - p * t + r * v) * D;
            a[8] = (g * G - h * z + l * A) * D;
            a[9] = (d * z - c * G - f * A) * D;
            a[10] = (s * E - u * t + x * w) * D;
            a[11] = (m * t - n * E - r * w) * D;
            a[12] = (h * B - g * C - k * A) * D;
            a[13] = (c * C - d * B + e * A) * D;
            a[14] = (u * v - s * y - q * w) * D;
            a[15] = (n * y - m * v + p * w) * D;
            return a
        },
        transpose: function (a, b) {
            a[0] = b[0];
            a[4] = b[1];
            a[8] = b[2];
            a[12] = b[3];
            a[1] = b[4];
            a[5] = b[5];
            a[9] = b[6];
            a[13] = b[7];
            a[2] = b[8];
            a[6] = b[9];
            a[10] = b[10];
            a[14] = b[11];
            a[3] = b[12];
            a[7] = b[13];
            a[11] = b[14];
            a[15] = b[15];
            return a
        },
        mul4: function (a, b, c, d, e, f) {
            a[0] = b[0] * c + b[4] * d + b[8] * e + b[12] * f;
            a[1] = b[1] * c + b[5] * d + b[9] * e + b[13] * f;
            a[2] = b[2] * c + b[6] * d + b[10] * e + b[14] * f;
            a[3] = b[3] * c + b[7] * d + b[11] * e + b[15] * f;
            return a
        },
        mulPoint: function (a, b, c, d, e) {
            a[0] = b[0] * c + b[4] * d + b[8] * e + b[12];
            a[1] = b[1] * c + b[5] * d + b[9] * e + b[13];
            a[2] = b[2] * c + b[6] * d + b[10] * e + b[14];
            return a
        },
        mulVec: function (a, b, c, d, e) {
            a[0] = b[0] * c + b[4] * d + b[8] * e;
            a[1] = b[1] * c + b[5] * d + b[9] * e;
            a[2] = b[2] * c + b[6] * d + b[10] * e;
            return a
        },
        perspective: function (a, b, c, d, e, f) {
            f = f || 0;
            b = 1 / Math.tan(0.00872664625 *
                b);
            a[0] = b / c;
            a[1] = a[2] = a[3] = 0;
            a[5] = b;
            a[4] = a[6] = a[7] = 0;
            a[8] = a[9] = 0;
            a[10] = (e + d) / (d - e) - 3.0518044E-5 * f;
            a[11] = -1;
            a[14] = 2 * e * d / (d - e);
            a[12] = a[13] = a[15] = 0;
            return a
        },
        perspectiveInfinite: function (a, b, c, d, e) {
            e = e || 0;
            b = 1 / Math.tan(0.00872664625 * b);
            a[0] = b / c;
            a[1] = a[2] = a[3] = 0;
            a[5] = b;
            a[4] = a[6] = a[7] = 0;
            a[8] = a[9] = 0;
            a[10] = a[11] = -1 - 3.0518044E-5 * e;
            a[14] = -2 * d;
            a[12] = a[13] = a[15] = 0;
            return a
        },
        ortho: function (a, b, c, d, e, f, g, h) {
            var k = 1 / (c - b),
                l = 1 / (e - d),
                n = 1 / (g - f);
            a[0] = k + k;
            a[1] = a[2] = a[3] = 0;
            a[5] = l + l;
            a[4] = a[6] = a[7] = 0;
            a[12] = -(c + b) * k;
            a[13] = -(e + d) * l;
            a[10] = -(n + n) - 3.0518044E-5 * (h || 0);
            a[14] = -(g + f) * n;
            a[8] = a[9] = a[11] = 0;
            a[15] = 1;
            return a
        },
        lookAt: function (a, b, c, d) {
            var e = a.subarray(0, 3),
                f = a.subarray(4, 7),
                g = a.subarray(8, 11);
            Vect.sub(g, b, c);
            Vect.cross(e, d, g);
            Vect.normalize(g, g);
            Vect.normalize(e, e);
            Vect.cross(f, g, e);
            Matrix.set(a, e[0], e[1], e[2], -Vect.dot(e, b), f[0], f[1], f[2], -Vect.dot(f, b), g[0], g[1], g[2], -Vect.dot(g, b), 0, 0, 0, 1)
        },
        copy: function (a, b) {
            for (var c = 0; 16 > c; ++c) a[c] = b[c]
        },
        copyToBuffer: function (a, b, c) {
            for (var d = 0; 16 > d; ++d) a[b + d] = c[d]
        }
    };

    function Mesh(a, b, c) {
        this.gl = a;
        this.desc = b;
        var d = b.isDynamicMesh;
        this.numSubMeshes = this.dynamicVertexData = 0;
        this.displayMatrix = Matrix.identity();
        this.name = b.name;
        this.modelMatrix = Matrix.identity();
        this.origin = b.transform ? Vect.create(b.transform[12], b.transform[13], b.transform[14], 1) : Vect.create(0, 5, 0, 1);
        this.stride = 32;
        if (this.vertexColor = b.vertexColor) this.stride += 4;
        if (this.secondaryTexCoord = b.secondaryTexCoord) this.stride += 8;
        c = new ByteStream(c.data);
        this.indexCount = b.indexCount;
        this.indexTypeSize =
            b.indexTypeSize;
        this.indexType = 4 == this.indexTypeSize ? a.UNSIGNED_INT : a.UNSIGNED_SHORT;
        this.indexBuffer = a.createBuffer();
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var e = c.readBytes(this.indexCount * this.indexTypeSize);
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, e, a.STATIC_DRAW);
        this.wireCount = b.wireCount;
        this.wireBuffer = a.createBuffer();
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.wireBuffer);
        e = c.readBytes(this.wireCount * this.indexTypeSize);
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, e, a.STATIC_DRAW);
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,
            null);
        this.vertexCount = b.vertexCount;
        this.vertexBuffer = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer);
        c = c.readBytes(this.vertexCount * this.stride);
        d ? (this.dynamicVertexData = new Uint8Array(c), a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW)) : a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW);
        a.bindBuffer(a.ARRAY_BUFFER, null);
        this.bounds = void 0 === b.minBound || void 0 === b.maxBound ? {
            min: Vect.create(-10, -10, -10, 1),
            max: Vect.create(10, 10, -0, 1)
        } : {
            min: Vect.create(b.minBound[0], b.minBound[1], b.minBound[2],
                1),
            max: Vect.create(b.maxBound[0], b.maxBound[1], b.maxBound[2], 1)
        };
        this.bounds.maxExtent = Math.max(Math.max(b.maxBound[0] - b.minBound[0], b.maxBound[1] - b.minBound[1]), b.maxBound[2] - b.minBound[2]);
        this.bounds.averageExtent = (b.maxBound[0] - b.minBound[0] + (b.maxBound[1] - b.minBound[1]) + (b.maxBound[2] - b.minBound[2])) / 3
    };

    function MeshRenderable(a, b, c) {
        this.mesh = a;
        this.gl = this.mesh.gl;
        this.indexOffset = b.firstIndex * a.indexTypeSize;
        this.indexCount = b.indexCount;
        this.wireIndexOffset = b.firstWireIndex * a.indexTypeSize;
        this.wireIndexCount = b.wireIndexCount;
        this.material = c;
        this.visible = !0
    }
    MeshRenderable.prototype.draw = function (a) {
        var b = this.gl;
        if (this.material.bind(a, this)) {
            a = this.material.shader.attribs;
            var c = this.mesh.stride;
            this.mesh.desc.cullBackFaces ? (b.enable(b.CULL_FACE), b.cullFace(b.BACK)) : b.disable(b.CULL_FACE);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            b.bindBuffer(b.ARRAY_BUFFER, this.mesh.vertexBuffer);
            b.enableVertexAttribArray(a.vPosition);
            b.enableVertexAttribArray(a.vTexCoord);
            b.enableVertexAttribArray(a.vTangent);
            b.enableVertexAttribArray(a.vBitangent);
            b.enableVertexAttribArray(a.vNormal);
            var d = this.mesh.vertexColor && void 0 !== a.vColor;
            d && b.enableVertexAttribArray(a.vColor);
            var e = this.mesh.secondaryTexCoord && void 0 !== a.vTexCoord2;
            e && b.enableVertexAttribArray(a.vTexCoord2);
            var f = 0;
            b.vertexAttribPointer(a.vPosition, 3, b.FLOAT, !1, c, f);
            f += 12;
            b.vertexAttribPointer(a.vTexCoord, 2, b.FLOAT, !1, c, f);
            f += 8;
            this.mesh.secondaryTexCoord && (e && b.vertexAttribPointer(a.vTexCoord2, 2, b.FLOAT, !1, c, f), f += 8);
            b.vertexAttribPointer(a.vTangent, 2, b.UNSIGNED_SHORT, !0, c, f);
            f +=
                4;
            b.vertexAttribPointer(a.vBitangent, 2, b.UNSIGNED_SHORT, !0, c, f);
            f += 4;
            b.vertexAttribPointer(a.vNormal, 2, b.UNSIGNED_SHORT, !0, c, f);
            d && b.vertexAttribPointer(a.vColor, 4, b.UNSIGNED_BYTE, !0, c, f + 4);
            b.drawElements(b.TRIANGLES, this.indexCount, this.mesh.indexType, this.indexOffset);
            b.disableVertexAttribArray(a.vPosition);
            b.disableVertexAttribArray(a.vTexCoord);
            b.disableVertexAttribArray(a.vTangent);
            b.disableVertexAttribArray(a.vBitangent);
            b.disableVertexAttribArray(a.vNormal);
            d && b.disableVertexAttribArray(a.vColor);
            e && b.disableVertexAttribArray(a.vTexCoord2)
        }
    };
    MeshRenderable.prototype.drawShadow = function (a) {
        var b = this.gl;
        this.mesh.desc.cullBackFaces ? (b.enable(b.CULL_FACE), b.cullFace(b.BACK)) : b.disable(b.CULL_FACE);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        b.bindBuffer(b.ARRAY_BUFFER, this.mesh.vertexBuffer);
        b.enableVertexAttribArray(a);
        b.vertexAttribPointer(a, 3, b.FLOAT, !1, this.mesh.stride, 0);
        b.drawElements(b.TRIANGLES, this.indexCount, this.mesh.indexType, this.indexOffset);
        b.disableVertexAttribArray(a)
    };
    MeshRenderable.prototype.drawAlphaShadow = function (a, b) {
        var c = this.gl;
        this.mesh.desc.cullBackFaces ? (c.enable(c.CULL_FACE), c.cullFace(c.BACK)) : c.disable(c.CULL_FACE);
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        c.bindBuffer(c.ARRAY_BUFFER, this.mesh.vertexBuffer);
        c.enableVertexAttribArray(a);
        c.enableVertexAttribArray(b);
        c.vertexAttribPointer(a, 3, c.FLOAT, !1, this.mesh.stride, 0);
        c.vertexAttribPointer(b, 2, c.FLOAT, !1, this.mesh.stride, 12);
        c.drawElements(c.TRIANGLES, this.indexCount, this.mesh.indexType,
            this.indexOffset);
        c.disableVertexAttribArray(a);
        c.disableVertexAttribArray(b)
    };
    MeshRenderable.prototype.drawAlphaPrepass = function (a) {
        var b = this.gl;
        if (this.material.bindAlphaPrepass(a, this)) {
            a = this.material.prepassShader.attribs;
            var c = this.mesh.stride;
            this.mesh.desc.cullBackFaces ? (b.enable(b.CULL_FACE), b.cullFace(b.BACK)) : b.disable(b.CULL_FACE);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
            b.bindBuffer(b.ARRAY_BUFFER, this.mesh.vertexBuffer);
            b.enableVertexAttribArray(a.vPosition);
            b.enableVertexAttribArray(a.vTexCoord);
            b.vertexAttribPointer(a.vPosition, 3, b.FLOAT, !1,
                c, 0);
            b.vertexAttribPointer(a.vTexCoord, 2, b.FLOAT, !1, c, 12);
            b.drawElements(b.TRIANGLES, this.indexCount, this.mesh.indexType, this.indexOffset);
            b.disableVertexAttribArray(a.vPosition);
            b.disableVertexAttribArray(a.vTexCoord)
        }
    };
    MeshRenderable.prototype.drawWire = function (a) {
        var b = this.material.wireShader.attribs,
            c = this.gl;
        this.material.bindWire(a, this) && (c.enableVertexAttribArray(b.vPosition), c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this.mesh.wireBuffer), c.bindBuffer(c.ARRAY_BUFFER, this.mesh.vertexBuffer), c.vertexAttribPointer(b.vPosition, 3, c.FLOAT, !1, this.mesh.stride, 0), c.drawElements(c.LINES, this.wireIndexCount, this.mesh.indexType, this.wireIndexOffset), c.disableVertexAttribArray(b.vPosition))
    };
    MeshRenderable.prototype.complete = function () {
        return this.material.complete()
    };
    var Network = {
        fetchImage: function (a, b, c) {
            var d = new Image;
            d.crossOrigin = "Anonymous";
            d.onload = function () {
                0 < d.width && 0 < d.height ? b(d) : c && c()
            };
            c && (req.onerror = function () {
                c()
            });
            d.src = a
        },
        fetchText: function (a, b, c, d) {
            var e = new XMLHttpRequest;
            e.open("GET", a, !0);
            e.onload = function () {
                200 == e.status ? b(e.responseText) : c && c()
            };
            c && (e.onerror = function () {
                c()
            });
            d && (e.onprogress = function (a) {
                d(a.loaded, a.total)
            });
            e.send()
        },
        fetchBinary: function (a, b, c, d) {
            var e = new XMLHttpRequest;
            e.open("GET", a, !0);
            e.responseType = "arraybuffer";
            e.onload = function () {
                200 == e.status ? b(e.response) : c && c()
            };
            c && (e.onerror = function () {
                c()
            });
            d && (e.onprogress = function (a) {
                d(a.loaded, a.total)
            });
            e.send()
        },
        fetchBinaryIncremental: function (a, b, c, d) {
            var e = new XMLHttpRequest;
            e.open("HEAD", a, !0);
            e.onload = function () {
                if (200 == e.status) {
                    var f = e.getResponseHeader("Accept-Ranges");
                    if (f && "none" != f) {
                        var g = e.getResponseHeader("Content-Length") | 0,
                            h = function (c, e) {
                                var f = new XMLHttpRequest;
                                f.open("GET", a, !0);
                                f.setRequestHeader("Range", "bytes=" + c + "-" + e);
                                f.responseType = "arraybuffer";
                                f.onload = function () {
                                    (206 == f.status || 200 == f.status) && b(f.response) && e < g && (c += d, e += d, e = e < g - 1 ? e : g - 1, h(c, e))
                                };
                                f.send()
                            };
                        h(0, d - 1)
                    } else c && c()
                } else c && c()
            };
            c && (e.onerror = function () {
                c()
            });
            e.send()
        }
    };

    function PlaybackControls(a) {
        this.debugString = "";
        this.init = !1;
        this.speedList = this.cameraList = this.animationList = this.playButton = this.timelineSlider = this.playbackRegion = this.previousFrameButton = this.nextFrameButton = this.pauseButton = this.playButton = 0;
        this.visible = !1;
        this.backgroundRegion = this.screenButton = 0;
        this.guiScreen = a;
        this.playbackRegion = new GUIRegion(a);
        this.idealSliderWidth = 650;
        this.totalListBoxPixelsX = 0;
        this.minWidth = 500;
        this.compactMode = !1;
        this.ui = a.ui;
        var b = "animationpause" + a.imageSetNumber +
            "x.png",
            c = "animationplay" + a.imageSetNumber + "x.png",
            d = "timelineLE" + a.imageSetNumber + "x.png",
            e = "timelineM" + a.imageSetNumber + "x.png",
            f = "timelineRE" + a.imageSetNumber + "x.png",
            g = a.ui.viewer.scene.sceneAnimator.animations.length;
        if (0 != g) {
            var h = this.idealSliderWidth;
            this.bottomOffset = 85;
            this.centerOffset = 60;
            var k = a.width / 2 + this.centerOffset,
                l = k - h / 2,
                k = k + h / 2,
                n = l - 14 - 32,
                m = k - n,
                p = 32 / a.height,
                r = this.bottomOffset / a.height,
                s = this.playbackRegion;
            s.controlRect.widthPercent = m / a.width;
            s.controlRect.heightPercent = p;
            s.controlRect.xPercent =
                n / a.width;
            s.controlRect.yPercent = r;
            p = 32 / m;
            this.pauseButton = new Button(this.guiScreen);
            this.pauseButton.controlRect.set(0, 0.125, p, 0.75);
            this.pauseButton.controlRect.opacity = 0.5;
            s.controlRect.registerChildControlRect(this.pauseButton.controlRect);
            this.pauseButton.linkControl(s.addImageElement(this.pauseButton.controlRect, b));
            this.playButton = new Button(this.guiScreen);
            this.playButton.controlRect.set(0, 0.125, p, 0.75);
            this.playButton.controlRect.opacity = 0.5;
            s.controlRect.registerChildControlRect(this.playButton.controlRect);
            this.playButton.linkControl(s.addImageElement(this.playButton.controlRect, c));
            b = h / m;
            m = (l - n) / m;
            this.timelineSlider = new TimelineSlider(this.guiScreen, s);
            this.timelineSlider.controlRect.set(m, 0.03125, b, 1);
            s.controlRect.registerChildControlRect(this.timelineSlider.controlRect);
            this.timelineSlider.setBackground3x1(s, d, e, f);
            this.pauseButton.controlRect.showControl(!a.ui.viewer.scene.sceneAnimator.paused);
            this.playButton.controlRect.showControl(a.ui.viewer.scene.sceneAnimator.paused);
            d = k + 14;
            e = this.bottomOffset +
                4;
            f = a.ui.viewer.scene.sceneAnimator.animations[0].cameraObjects.length;
            a.ui.viewer.scene.sceneAnimator.selectDefaultCamera();
            a.ui.viewer.scene.sceneAnimator.setViewFromSelectedCamera();
            this.maxListPixelsX = 0;
            if (1 < f) {
                this.cameraList = new ListBox(a);
                for (m = 0; m < f; m++) this.cameraList.addItem(a.ui.viewer.scene.sceneAnimator.animations[0].cameraObjects[m].name, 0, 0);
                this.cameraList.spawnControl(d, e, 10, 24, !0, 8);
                this.cameraList.selectItem(a.ui.viewer.scene.sceneAnimator.selectedCameraIndex);
                this.maxListPixelsX =
                    this.cameraList.localPixelsX;
                this.totalListBoxPixelsX += this.cameraList.localPixelsX + 14
            }
            if (1 < g) {
                this.animationList = new ListBox(a);
                for (m = 0; m < g; m++) this.animationList.addItem(a.ui.viewer.scene.sceneAnimator.animations[m].name, 0, 0);
                this.animationList.spawnControl(d, e, 10, 24, !0, 8);
                this.maxListPixelsX < this.animationList.localPixelsX && (this.maxListPixelsX = this.animationList.localPixelsX);
                this.totalListBoxPixelsX += this.animationList.localPixelsX + 14;
                this.animationList.selectItem(a.ui.viewer.scene.sceneAnimator.selectedAnimationIndex)
            }
            d =
                n - 44 - 14;
            m = k - d + this.totalListBoxPixelsX;
            this.speedList = new ListBox(a);
            this.speedList.addItem("4.0x", 4, 0);
            this.speedList.addItem("2.0x", 4, 0);
            this.speedList.addItem("1.0x", 4, 0);
            this.speedList.addItem("0.5x", 4, 0);
            this.speedList.addItem("0.25x", -2, 0);
            this.speedList.spawnControl(d, e, 44, 24, !1, 0);
            this.speedList.selectItem(2);
            m > a.width && (this.idealSliderWidth = a.width - (118 + (this.totalListBoxPixelsX + 14)) - this.centerOffset, a = 0, this.cameraList && a++, this.animationList && a++, 1 == a && (this.idealSliderWidth += 56, this.centerOffset -=
                14), 2 == a && (this.idealSliderWidth += 63, this.centerOffset -= 63));
            this.setupCallbacks()
        }
    }
    PlaybackControls.prototype.resize = function (a) {
        a.ui.viewer.scene.sceneAnimator.showPlayControls || (a.width = 1, a.height = 1);
        this.compactMode = a.width < this.minWidth;
        var b = this.bottomOffset,
            c = this.bottomOffset + 4,
            d = 0;
        this.cameraList && this.animationList ? d += 42 + this.cameraList.localPixelsX + this.animationList.localPixelsX : this.cameraList ? d += 28 + this.cameraList.localPixelsX : this.animationList && (d += 28 + this.animationList.localPixelsX);
        var e = a.width - d - 72;
        0 == d && (e -= 14);
        var f = 116,
            g = f + e + 14;
        this.compactMode && (f = 58, e +=
            44 + d, 0 < d && (b += 32), !d && (c += 32));
        var d = 32 / e,
            h = d + 14 / e,
            k = 1 - h,
            l = this.playbackRegion;
        l.controlRect.widthPercent = e / a.width;
        l.controlRect.heightPercent = 32 / a.height;
        l.controlRect.xPercent = f / a.width;
        l.controlRect.yPercent = b / a.height;
        this.pauseButton.controlRect.set(0, 0.125, d, 0.75);
        this.playButton.controlRect.set(0, 0.125, d, 0.75);
        this.timelineSlider.controlRect.set(h, 0.03125, k, 1);
        this.timelineSlider.setSize(e - 46, 32);
        l.controlRect.updateElement();
        l.controlRect.updateChildElements();
        this.speedList.setControl(58,
            c, 44, 24, !1);
        this.cameraList && (this.cameraList.setControl(g, c, 10, 24, !0, 8), g += this.cameraList.localPixelsX + 14);
        this.animationList && this.animationList.setControl(g, c, 10, 24, !0, 8);
        this.timelineSlider.backgroundControl.alignBackground()
    };
    PlaybackControls.prototype.setupCallbacks = function () {
        var a = function (a) {
                "0.01x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(0.01);
                "0.05x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(0.05);
                "0.25x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(0.25);
                "0.5x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(0.5);
                "1.0x" == this.speedList.selectedItemText &&
                    this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(1);
                "2.0x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(2);
                "4.0x" == this.speedList.selectedItemText && this.ui.viewer.scene.sceneAnimator.setPlaybackSpeed(4)
            }.bind(this),
            b = function (a) {
                this.ui.viewer.scene.sceneAnimator.selectCamera(this.cameraList.selectedIndex);
                this.ui.viewer.wake()
            }.bind(this),
            c = function (a) {
                this.ui.viewer.scene.sceneAnimator.selectAnimation(this.animationList.selectedIndex);
                this.ui.viewer.wake()
            }.bind(this);
        this.speedList && (this.speedList.selectionChangedCallback = a);
        this.cameraList && (this.cameraList.selectionChangedCallback = b);
        this.animationList && (this.animationList.selectionChangedCallback = c);
        this.playButton.controlRect.linkedControl.onclick = function () {
            this.ui.viewer.scene.sceneAnimator.pause(!1);
            this.playButton.controlRect.showControl(!1);
            this.pauseButton.controlRect.showControl(!0);
            this.ui.viewer.wake()
        }.bind(this);
        this.pauseButton.controlRect.linkedControl.onclick = function () {
            this.ui.viewer.scene.sceneAnimator.pause(!0);
            this.playButton.controlRect.showControl(!0);
            this.pauseButton.controlRect.showControl(!1)
        }.bind(this)
    };

    function PostRender(a, b, c) {
        this.gl = a;
        this.desc = b;
        b = [];
        0 != this.desc.sharpen && b.push("#define SHARPEN");
        (this.useBloom = 0 < this.desc.bloomColor[0] * this.desc.bloomColor[3] || 0 < this.desc.bloomColor[1] * this.desc.bloomColor[3] || 0 < this.desc.bloomColor[2] * this.desc.bloomColor[3]) && b.push("#define BLOOM");
        0 != this.desc.vignette[3] && b.push("#define VIGNETTE");
        1 == this.desc.saturation[0] * this.desc.saturation[3] && 1 == this.desc.saturation[1] * this.desc.saturation[3] && 1 == this.desc.saturation[2] * this.desc.saturation[3] ||
            b.push("#define SATURATION");
        1 == this.desc.contrast[0] * this.desc.contrast[3] && 1 == this.desc.contrast[1] * this.desc.contrast[3] && 1 == this.desc.contrast[2] * this.desc.contrast[3] && 1 == this.desc.brightness[0] * this.desc.brightness[3] && 1 == this.desc.brightness[1] * this.desc.brightness[3] && 1 == this.desc.brightness[2] * this.desc.brightness[3] || b.push("#define CONTRAST");
        0 != this.desc.grain && b.push("#define GRAIN");
        1 == this.desc.toneMap ? b.push("#define REINHARD") : 2 == this.desc.toneMap && b.push("#define HEJL");
        this.desc.colorLUT &&
            b.push("#define COLOR_LUT");
        this.sampleIndex = 0;
        this.sampleCount = 1;
        c && (this.sampleCount = 4, this.sampleOffsets = [
            [-0.5, -0.5],
            [0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5]
        ]);
        this.aaShader = a.shaderCache.fromURLs("postvert.glsl", "postaa.glsl");
        this.shader = a.shaderCache.fromURLs("postvert.glsl", "postfrag.glsl", b);
        this.plainShader = a.shaderCache.fromURLs("postvert.glsl", "postfrag.glsl", []);
        this.fullscreenTriangle = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, this.fullscreenTriangle);
        c = new Float32Array([0, 0, 2, 0, 0, 2]);
        a.bufferData(a.ARRAY_BUFFER,
            c, a.STATIC_DRAW);
        a.bindBuffer(a.ARRAY_BUFFER, null);
        if (this.useBloom) {
            this.bloomTextures = [];
            this.bloomTargets = [];
            for (c = 0; 2 > c; ++c) b = {
                width: 256,
                height: 256,
                clamp: !0
            }, this.bloomTextures[c] = new Texture(a, b), this.bloomTextures[c].loadArray(null, a.RGBA, a.ext.textureHalf && a.ext.textureHalfLinear ? a.ext.textureHalf.HALF_FLOAT_OES : a.UNSIGNED_BYTE), this.bloomTargets[c] = new Framebuffer(a, {
                width: b.width,
                height: b.height,
                color0: this.bloomTextures[c]
            });
            for (this.bloomSamples = 64; this.bloomSamples + 16 >= a.limits.fragmentUniforms;) this.bloomSamples /=
                2;
            this.bloomShader = a.shaderCache.fromURLs("postvert.glsl", "bloom.glsl", ["#define BLOOM_SAMPLES " + this.bloomSamples]);
            this.shrinkShader = a.shaderCache.fromURLs("postvert.glsl", "bloomshrink.glsl")
        }
        a = new Uint8Array(16384);
        for (c = 0; 16384 > c; c++) {
            b = 255 * Math.random();
            var d = 255 * Math.random();
            a[c] = 0.5 * (b + d)
        }
        this.noiseTexture = new Texture(this.gl, {
            width: 128,
            height: 128
        });
        this.noiseTexture.loadArray(a, this.gl.LUMINANCE);
        this.desc.colorLUT && (a = this.desc.colorLUT, this.colorLUT = new Texture(this.gl, {
            width: a.length /
                3 | 0,
            height: 1,
            clamp: !0
        }), this.colorLUT.loadArray(new Uint8Array(a), this.gl.RGB));
        this.blackTexture = new Texture(this.gl, {
            width: 1,
            height: 1
        });
        this.blackTexture.loadArray(new Uint8Array([0, 0, 0, 0]));
        this.bloomResult = this.blackTexture
    }
    PostRender.prototype.prepareBloom = function (a) {
        if (this.useBloom && this.bloomShader.complete() && this.shrinkShader.complete()) {
            this.shrinkShader.bind();
            this.bloomTargets[1].bind();
            a.bind(this.shrinkShader.samplers.tInput);
            this.fillScreen(this.shrinkShader.attribs.vCoord);
            this.bloomShader.bind();
            var b = [];
            this.bloomTargets[0].bind();
            this.bloomTextures[1].bind(this.bloomShader.samplers.tInput);
            for (var c = 0, d = 0; d < this.bloomSamples; ++d) {
                var e = -1 + 2 * d / (this.bloomSamples - 1),
                    f;
                f = 4 * e;
                f = Math.exp(-0.5 * f * f / 1) / 2.50662827463;
                c += f;
                b[4 * d + 0] = e * this.desc.bloomSize;
                b[4 * d + 1] = 0;
                b[4 * d + 2] = f;
                b[4 * d + 3] = 0
            }
            for (d = 0; d < this.bloomSamples; ++d) b[4 * d + 2] /= c;
            this.gl.uniform4fv(this.bloomShader.params.uKernel, b);
            this.fillScreen(this.bloomShader.attribs.vCoord);
            this.bloomTargets[1].bind();
            this.bloomTextures[0].bind(this.bloomShader.samplers.tInput);
            for (d = 0; d < this.bloomSamples; ++d) c = b[4 * d + 0], c *= a.desc.width / a.desc.height, b[4 * d + 0] = 0, b[4 * d + 1] = c;
            this.gl.uniform4fv(this.bloomShader.params.uKernel, b);
            this.fillScreen(this.bloomShader.attribs.vCoord);
            this.bloomResult = this.bloomTextures[1]
        } else this.bloomResult = this.blackTexture
    };
    PostRender.prototype.computeParams = function (a, b) {
        var c = this.desc,
            d = {};
        d.scale = [c.contrast[0] * c.contrast[3], c.contrast[1] * c.contrast[3], c.contrast[2] * c.contrast[3]];
        d.bias = [c.bias[0] * c.bias[3], c.bias[1] * c.bias[3], c.bias[2] * c.bias[3]];
        d.bias = [-d.bias[0] * d.scale[0] + d.bias[0], -d.bias[1] * d.scale[1] + d.bias[1], -d.bias[2] * d.scale[2] + d.bias[2]];
        var e = [c.brightness[0] * c.brightness[3], c.brightness[1] * c.brightness[3], c.brightness[2] * c.brightness[3]];
        d.scale = [d.scale[0] * e[0], d.scale[1] * e[1], d.scale[2] * e[2]];
        d.bias = [d.bias[0] * e[0], d.bias[1] * e[1], d.bias[2] * e[2]];
        d.saturation = [c.saturation[0] * c.saturation[3], c.saturation[1] * c.saturation[3], c.saturation[2] * c.saturation[3]];
        d.bloomColor = [c.bloomColor[0] * c.bloomColor[3], c.bloomColor[1] * c.bloomColor[3], c.bloomColor[2] * c.bloomColor[3]];
        d.sharpen = [c.sharpen, 0.25 * c.sharpen, c.sharpenLimit];
        d.sharpenKernel = [1 / a, 0, 0, 1 / b];
        e = a > b ? a : b;
        d.vignetteAspect = [a / e, b / e, 0.5 * a / e, 0.5 * b / e];
        d.vignette = [2 * (1 - c.vignette[0]) * c.vignette[3], 2 * (1 - c.vignette[1]) * c.vignette[3], 2 * (1 - c.vignette[2]) *
            c.vignette[3], c.vignetteCurve
        ];
        var e = 1 / this.noiseTexture.desc.width,
            f = 1 / this.noiseTexture.desc.height,
            g = 1 - c.grainSharpness;
        d.grainCoord = [e * a, f * b, 0.5 * g * e, 0.5 * g * f];
        d.grainScaleBias = [2 * c.grain, -c.grain];
        return d
    };
    PostRender.prototype.present = function (a, b, c, d) {
        d || this.prepareBloom(a);
        1 < this.sampleCount && this.allocAABuffer(b, c);
        d = d ? this.plainShader : this.shader;
        if (d.bind()) {
            var e = this.gl,
                f = d.samplers,
                g = d.params,
                h = this.computeParams(b, c);
            a.bind(f.tInput);
            this.bloomResult.bind(f.tBloom);
            this.noiseTexture.bind(f.tGrain);
            this.colorLUT && this.colorLUT.bind(f.tLUT);
            e.uniform3fv(g.uScale, h.scale);
            e.uniform3fv(g.uBias, h.bias);
            e.uniform3fv(g.uSaturation, h.saturation);
            e.uniform4fv(g.uSharpenKernel, h.sharpenKernel);
            e.uniform3fv(g.uSharpness,
                h.sharpen);
            e.uniform3fv(g.uBloomColor, h.bloomColor);
            e.uniform4fv(g.uVignetteAspect, h.vignetteAspect);
            e.uniform4fv(g.uVignette, h.vignette);
            e.uniform4fv(g.uGrainCoord, h.grainCoord);
            e.uniform2fv(g.uGrainScaleBias, h.grainScaleBias);
            if (a = 1 < this.sampleCount && 0 <= this.sampleIndex) {
                var k = 1 / (1 + this.sampleIndex);
                this.sampleIndex += 1;
                1 > k && (e.enable(e.BLEND), e.blendColor(k, k, k, k), e.blendFunc(e.CONSTANT_ALPHA, e.ONE_MINUS_CONSTANT_ALPHA));
                this.aaTarget.bind()
            } else Framebuffer.bindNone(e), 1 < this.sampleCount && (this.sampleIndex +=
                1);
            e.viewport(0, 0, b, c);
            this.fillScreen(d.attribs.vCoord);
            a && (1 > k && e.disable(e.BLEND), Framebuffer.bindNone(e), this.aaShader.bind(), this.aaBuffer.bind(this.aaShader.samplers.tInput), this.fillScreen(this.aaShader.attribs.vCoord))
        }
    };
    PostRender.prototype.allocAABuffer = function (a, b) {
        this.aaBuffer && this.aaBuffer.desc.width == a && this.aaBuffer.desc.height == b || (this.aaBuffer && this.aaBuffer.destroy(), this.aaBuffer = new Texture(this.gl, {
            width: a,
            height: b,
            clamp: !0
        }), this.aaBuffer.loadArray(), this.aaTarget = new Framebuffer(this.gl, {
            color0: this.aaBuffer,
            ignoreStatus: !0
        }))
    };
    PostRender.prototype.adjustProjectionForSupersampling = function (a) {
        if (1 < this.sampleCount) {
            var b = this.currentSample(),
                c = this.sampleOffsets[b][0] / a.size[0],
                b = this.sampleOffsets[b][1] / a.size[1],
                c = Matrix.translation(Matrix.empty(), c, b, 0);
            Matrix.mul(a.projectionMatrix, c, a.projectionMatrix)
        }
    };
    PostRender.prototype.discardAAHistory = function () {
        this.sampleIndex = -1
    };
    PostRender.prototype.currentSample = function () {
        return (0 > this.sampleIndex ? 0 : this.sampleIndex) % this.sampleCount
    };
    PostRender.prototype.fillScreen = function (a) {
        var b = this.gl;
        b.bindBuffer(b.ARRAY_BUFFER, this.fullscreenTriangle);
        b.enableVertexAttribArray(a);
        b.vertexAttribPointer(a, 2, b.FLOAT, !1, 0, 0);
        b.drawArrays(b.TRIANGLES, 0, 3);
        b.disableVertexAttribArray(a);
        b.bindBuffer(b.ARRAY_BUFFER, null)
    };
    PostRender.prototype.blitTexture = function (a) {
        this.aaShader.bind();
        a.bind(this.aaShader.samplers.tInput);
        this.fillScreen(this.aaShader.attribs.vCoord)
    };

    function Scene(a) {
        this.gl = a;
        this.name = "untitled";
        this.meshes = [];
        this.meshRenderables = [];
        this.materials = {};
        this.sky = this.view = null;
        this.selectedPartIndex = 0;
        this.soloPart = !1;
        this.miscnotes = "";
        this.nextView = null;
        this.viewFade = 0;
        this.refractionSurface = this.shadow = this.stripData = this.lights = null;
        this.sceneAnimator = this.frameCounter = 0;
        this.sceneLoaded = !1;
        this.debugString = ""
    }
    Scene.prototype.load = function (a) {
        var b = this.gl,
            c, d = a.extract("scene.json");
        if (void 0 !== d) {
            if (!a.checkSignature(d)) return !1;
            d = (new ByteStream(d.data)).asString();
            if (null == d || 0 >= d.length) return !1;
            try {
                c = JSON.parse(d)
            } catch (e) {
                return console.error(e), !1
            }
        } else return !1;
        this.metaData = c.metaData;
        this.view = new View(c.mainCamera.view);
        this.sky = new Sky(this.gl, a, c.sky);
        this.lights = new Lights(c.lights, this.view);
        this.materialsList = [];
        this.materials = {};
        for (var f in c.materials) {
            var g = c.materials[f];
            g.lightCount =
                this.lights.count;
            g.shadowCount = this.lights.shadowCount;
            d = new Material(this.gl, a, g);
            this.materials[g.name] = d;
            this.materialsList.push(d)
        }
        if (c.meshes)
            for (g = 0; g < c.meshes.length; ++g) {
                f = c.meshes[g];
                f = new Mesh(this.gl, f, a.extract(f.file));
                this.meshes.push(f);
                for (var h = 0; h < f.desc.subMeshes.length; ++h) {
                    var k = f.desc.subMeshes[h];
                    if (d = this.materials[k.material]) f.numSubMeshes++, this.meshRenderables.push(new MeshRenderable(f, k, d))
                }
            }
        this.bounds = new Bounds(this.meshes);
        this.postRender = new PostRender(this.gl, c.mainCamera.post,
            !0);
        this.shadow = new ShadowCollector(b, this.lights.shadowCount);
        this.cameras = c.Cameras;
        c.AnimData && (this.sceneAnimator = new SceneAnimator(this, a, c.AnimData));
        c.fog && (this.fog = new Fog(b, c.fog));
        c.shadowFloor && (this.shadowFloor = new ShadowFloor(b, c.shadowFloor, this.shadow, this.lights));
        return this.sceneLoaded = !0
    };
    Scene.prototype.update = function () {
        this.sceneAnimator && (this.frameCounter++, this.lights.flagUpdateAnimatedLighting(), this.sceneAnimator.drawAnimated && (1 == this.frameCounter ? this.sceneAnimator.resetPlayback() : this.sceneAnimator.updateAnimationPlayback()));
        this.lights.update(this.view, this.bounds)
    };
    Scene.prototype.collectShadows = function (a) {
        this.shadow.collect(this, a)
    };
    Scene.prototype.draw = function (a) {
        var b = this.gl;
        if (this.sceneLoaded) {
            this.sky.setClearColor();
            b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT | b.STENCIL_BUFFER_BIT);
            b.enable(b.DEPTH_TEST);
            this.sky.draw(this);
            this.shadowFloor && this.shadowFloor.draw(this);
            for (var c = 0; c < this.meshRenderables.length; ++c) this.meshRenderables[c].material.usesBlending || this.meshRenderables[c].material.usesRefraction || !this.meshRenderables[c].visible || this.meshRenderables[c].draw(this);
            b.enable(b.POLYGON_OFFSET_FILL);
            b.polygonOffset(1,
                1);
            b.colorMask(!1, !1, !1, !1);
            for (c = 0; c < this.meshRenderables.length; ++c) this.meshRenderables[c].drawAlphaPrepass(this);
            b.colorMask(!0, !0, !0, !0);
            b.disable(b.POLYGON_OFFSET_FILL);
            b.depthFunc(b.LEQUAL);
            b.depthMask(!1);
            for (c = 0; c < this.meshRenderables.length; ++c) this.meshRenderables[c].material.usesBlending && this.meshRenderables[c].visible && this.meshRenderables[c].draw(this);
            b.disable(b.BLEND);
            b.depthMask(!0);
            b.depthFunc(b.LESS);
            for (var d = !1, c = 0; c < this.meshRenderables.length; ++c)
                if (this.meshRenderables[c].material.usesRefraction) {
                    d = !0;
                    break
                } if (d)
                for (this.refractionSurface && this.refractionSurface.desc.width == a.color0.desc.width && this.refractionSurface.desc.height == a.color0.desc.height || (this.refractionSurface = new Texture(b, a.color0.desc), this.refractionSurface.loadArray(null, a.color0.format, a.color0.componentType), this.refractionBuffer = new Framebuffer(this.gl, {
                        color0: this.refractionSurface
                    })), this.refractionBuffer.bind(), this.postRender.blitTexture(a.color0), a.bind(), c = 0; c < this.meshRenderables.length; ++c) this.meshRenderables[c].material.usesRefraction &&
                    this.meshRenderables[c].visible && this.meshRenderables[c].draw(this);
            if (this.stripData.activeWireframe() && 0 < this.meshRenderables.length) {
                for (c = 0; c < this.meshRenderables.length; ++c) this.meshRenderables[c].visible && this.meshRenderables[c].drawWire(this);
                b.depthMask(!0)
            }
            b.disable(b.BLEND)
        }
    };
    Scene.prototype.drawSecondary = function (a) {
        this.fog && this.fog.draw(this, a)
    };
    Scene.prototype.complete = function () {
        if (!this.sky.complete() || !this.shadow.complete() || this.fog && !this.fog.complete() || this.shadowFloor && !this.shadowFloor.complete()) return !1;
        for (var a = 0; a < this.meshRenderables.length; ++a)
            if (!this.meshRenderables[a].complete()) return !1;
        return !0
    };

    function SceneAnimator(a, b, c) {
        this.scene = a;
        this.animations = [];
        this.skinningRigs = [];
        this.meshIDs = [];
        this.lightIDs = [];
        this.materialIDs = [];
        this.views = [];
        this.viewYawOffsets = [];
        this.viewPitchOffsets = [];
        this.cameraObjectIndices = [];
        this.cameraChildrenIndices = [];
        this.subMeshObjectIndices = [];
        this.subMeshLiveIndices = [];
        this.scene = a;
        this.selectedCameraIndex = -1;
        this.selectedAnimationIndex = 0;
        this.debugString = "";
        this.scenePlaybackSpeed = this.playbackSpeed = 1;
        this.animationProgress = this.totalSeconds = 0;
        this.paused =
            this.autoAdvanceNextAnimation = !1;
        this.animateVisibility = this.drawAnimated = this.linkSceneObjects = this.loadSkinningRigs = this.animateMaterials = this.animateTurntables = this.enableSkinning = this.animateMeshes = this.animateLights = this.playAnimations = this.loadAnimations = !0;
        this.showDebugInfo = !1;
        this.loopCount = 0;
        this.loopTurntables = this.lockPlayback = !1;
        this.fogObjectIndex = -1;
        this.unitScaleSkinnedMeshes = !0;
        this.sceneScale = c.sceneScale;
        this.defaultCameraGlobalIndex = c.selectedCamera;
        this.selectedAnimationIndex =
            c.selectedAnimation;
        this.autoPlayAnims = c.autoPlayAnims;
        this.showPlayControls = c.showPlayControls;
        c.scenePlaybackSpeed && (this.scenePlaybackSpeed = c.scenePlaybackSpeed, 0 == this.scenePlaybackSpeed && (this.scenePlaybackSpeed = 1));
        this.autoPlayAnims || (this.paused = !0);
        if (this.loadAnimations) {
            if (c.meshIDs)
                for (var d = c.meshIDs.length, e = 0; e < d; ++e) {
                    var f = c.meshIDs[e].partIndex;
                    this.meshIDs.push(f)
                }
            if (c.lightIDs)
                for (d = c.lightIDs.length, e = 0; e < d; ++e) f = c.lightIDs[e], f = f.partIndex, this.lightIDs.push(f);
            if (c.materialIDs)
                for (d =
                    c.materialIDs.length, e = 0; e < d; ++e) f = c.materialIDs[e], f = f.partIndex, this.materialIDs.push(f);
            this.numMatricesInTable = c.numMatrices;
            e = b.get("MatTable.bin");
            f = new ByteStream(e.data);
            e || (this.numMatricesInTable = 0, this.debugString += "<br>No mattable?");
            if (c.skinningRigs && this.loadSkinningRigs)
                for (d = c.skinningRigs.length, e = 0; e < d; ++e) {
                    var g = new SkinningRig(b, c.skinningRigs[e], f);
                    "" == g.debugString ? this.skinningRigs.push(g) : (this.debugString += "<br>Error loading skinning rig " + e + " :" + g.debugString, this.debugString +=
                        "<br>Skipping the rest", e = d)
                }
            if (c.animations)
                for (f = c.animations.length, e = 0; e < f; ++e) d = new Animation(b, c.animations[e]), this.animations.push(d);
            this.startMS = Date.now();
            f = this.animations.length;
            if (this.linkSceneObjects && 0 != f) {
                for (e = 0; e < f; e++)
                    for (b = this.animations[e], d = b.animatedObjects.length, c = 0; c < d; c++) g = b.animatedObjects[c], "LightSO" == g.sceneObjectType && (g.lightIndex = this.findLightIndexByPartIndex(c), -1 != g.lightIndex ? b.lightObjects.push(g) : this.debugString += "<br> got light not in scene " + g.name),
                        "FogSO" == g.sceneObjectType && (this.fogObjectIndex = c), "SubMeshSO" == g.sceneObjectType && 0 == e && (this.subMeshObjectIndices.push(c), this.subMeshLiveIndices.push(-1)), "Material" == g.sceneObjectType && (g.materialIndex = this.findMaterialIndexByPartIndex(c), -1 == g.materialIndex ? this.debugString += "<br> can't find material index for object " + c : b.materialObjects.push(g)), "TurnTableSO" == g.sceneObjectType && b.turnTableObjects.push(g), "MeshSO" == g.sceneObjectType && (g.meshIndex = this.findMeshIndexByPartIndex(this.scene.meshes,
                            c), -1 == g.meshIndex ? (this.debugString += "<br> can't find mesh index for object " + c, this.logObjectInfo(c, 0)) : (b.meshObjects.push(g), g.mesh = this.scene.meshes[g.meshIndex], -1 != g.skinningRigIndex && g.mesh && g.skinningRigIndex < this.skinningRigs.length && (g.skinningRig = this.skinningRigs[g.skinningRigIndex], g.skinningRig.isRigidSkin || (g.mesh.dynamicVertexData ? g.skinningRig.useOriginalMeshVertices(g.mesh) : (this.debugString += "Skinning object - but mesh is not dynamic", this.debugString += "<br>Rig index " + g.skinningRigIndex,
                            this.debugString += " not tagged as rigid"))))), "CameraSO" == g.sceneObjectType && b.cameraObjects.push(g);
                b = this.animations[0];
                c = b.cameraObjects.length;
                for (e = 0; e < c; e++)
                    if (f = b.cameraObjects[e], d = this.scene.cameras[f.name]) {
                        if (d = d.view) d = new View(d), this.cameraObjectIndices.push(f.id), this.views.push(d), this.viewYawOffsets.push(0), this.viewPitchOffsets.push(0)
                    } else this.debugString += "<br>no camDesc for " + f.name, this.views.push(a.view);
                a = this.scene.meshes.length;
                f = this.subMeshObjectIndices.length;
                for (e = d =
                    0; e < a; e++)
                    for (g = this.scene.meshes[e], c = 0; c < f; c++) {
                        var h = this.subMeshObjectIndices[c],
                            k = b.animatedObjects[h],
                            l = b.animatedObjects[k.parentIndex];
                        l.mesh || (this.debugString += "<br>submesh parent object has no mesh?", this.debugString += "<br>obj.name " + k.name, this.debugString += "<br>parent.name " + l.name, this.debugString += "<br>submesh index " + c, this.debugString += "<br>obj.index " + h);
                        if (l.mesh == g) {
                            for (h = 0; h < g.numSubMeshes; h++) this.subMeshLiveIndices[c + (g.numSubMeshes - 1 - h)] = d, d++;
                            c = f
                        }
                    }
                for (e = 0; e < f; e++) - 1 == this.subMeshLiveIndices[e] &&
                    (this.debugString += "<br>Missing mesh? Unused submesh " + e + " of " + f);
                this.showDebugInfo = this.stopEverything = this.runDebugMode = !1;
                this.selectDefaultCamera();
                this.findCameraChildren();
                this.findFixedTransforms();
                this.runDebugMode && (this.setAnimationProgress(0, !0), "" != this.debugString ? this.stopEverything = !0 : this.checkDebug())
            }
        } else this.debugString += "<br>Skip loading animation data"
    }
    SceneAnimator.prototype.logTimes = function () {
        this.debugString += "<br>Times";
        var a = this.animations[0],
            b = a.animatedObjects.length;
        this.debugString += "<br>Animation totalSeconds " + a.totalSeconds;
        this.debugString += "<br>Animation totalFrames " + a.totalFrames;
        this.debugString += "<br>Animation totalObjects " + b;
        for (var c = 0; c < b; c++) {
            var d = a.animatedObjects[c];
            this.debugString += "<br>Object: " + c;
            this.debugString += " End: " + d.endTime;
            this.debugString += " Length: " + d.animationLength;
            this.debugString += " Frames: " + d.totalFrames
        }
    };
    SceneAnimator.prototype.flagAllForDebugging = function () {
        for (var a = this.animations.length, b = 0; b < a; b++)
            for (var c = this.animations[b], d = c.animatedObjects.length, e = 0; e < d; e++) c.animatedObjects[e].debugMe = !0
    };
    SceneAnimator.prototype.checkDebug = function () {
        this.debugString = "<br>--------------------------------------Debug Info:";
        this.debugString += "<br>this.selectedAnimationIndex :" + this.selectedAnimationIndex;
        var a = this.animations[this.selectedAnimationIndex],
            b = a.animatedObjects.length;
        this.debugString += "<br>numAnimatedObjects :" + b;
        "" != a.debugString && (this.debugString += "<br>--------------------------------------------------Got animation bug info:", this.debugString += a.debugString, this.showDebugInfo = this.stopEverything = !0, a.debugString = "");
        for (var c = 0; c < b; c++) {
            var d = a.animatedObjects[c];
            if ("" != d.debugString || "" != d.animatedLocalTransform.debugString) this.debugString += "<br>--------------------------------------------------Got object bug info:", this.debugString += d.debugString, this.debugString += d.animatedLocalTransform.debugString, this.showDebugInfo = this.stopEverything = !0, d.debugString = "", d.animatedLocalTransform.debugString = "";
            d.skinningRig && "" != d.skinningRig.debugString && (this.debugString += "<br>--------------------------------------------------Got skin rig info:",
                this.debugString += d.skinningRig.debugString, d.skinningRig.debugString = "", this.showDebugInfo = this.stopEverything = !0)
        }
        this.debugString += "<br>--------------------------------------Done Debug Info:"
    };
    SceneAnimator.prototype.logObjectInfo = function (a, b) {
        var c = this.animations[this.selectedAnimationIndex],
            d = b * c.originalFPS;
        if (a >= c.animatedObjects.length) this.debugString += "object index " + a + " exceeds " + c.animatedObjects.length;
        else {
            var e = c.animatedObjects[a],
                f = c.animatedObjects[e.modelPartIndex],
                g = c.getObjectAnimationFramePercent(e, b),
                h = c.getObjectAnimationFramePercent(f, b);
            this.debugString = "";
            this.debugString += "<br>Object Name: " + e.name;
            this.debugString += "<br>Object Type: " + e.sceneObjectType;
            this.debugString +=
                "<br>Object Index: " + e.id;
            this.debugString += "<br>Part Index: " + e.modelPartIndex;
            this.debugString += "<br>Part Scale: " + e.modelPartScale;
            this.debugString += "<br>Mesh Index: " + e.meshIndex;
            this.debugString += "<br>Light Index: " + e.lightIndex;
            this.debugString += "<br>Deformer Index: " + e.skinningRigIndex;
            this.debugString += "<br>Parent Index: " + e.parentIndex;
            this.debugString += "<br>Scene time " + b;
            this.debugString += "<br>Scene framepercent " + d;
            this.debugString += "<br>Object looped framepercent " + g;
            this.debugString +=
                "<br>Model  looped framepercent " + h;
            this.debugString += "<br>Object Anim length " + e.animationLength;
            this.debugString += "<br>Object Total frames " + e.totalFrames;
            this.debugString += "<br>Object FPS " + e.modelPartFPS;
            this.debugString += "<br>Model Part Anim length " + f.animationLength;
            this.debugString += "<br>Model total frames " + f.totalFrames;
            this.debugString += "<br>Model Part FPS " + f.modelPartFPS;
            d = Matrix.identity();
            c.getWorldTransform(e.id, b, d, this.sceneScale, !0);
            this.debugString += e.debugString;
            var c = d[0],
                e =
                d[1],
                f = d[2],
                g = d[4],
                h = d[5],
                k = d[6],
                l = d[8],
                n = d[9],
                d = d[10];
            Math.sqrt(c * c + e * e + f * f);
            Math.sqrt(g * g + h * h + k * k);
            Math.sqrt(l * l + n * n + d * d)
        }
    };
    SceneAnimator.prototype.resetPlayback = function () {
        this.startMS = Date.now();
        this.animationProgress = this.totalSeconds = 0;
        this.setAnimationProgress(0, !0)
    };
    SceneAnimator.prototype.pause = function (a) {
        this.paused = a;
        this.startMS = Date.now() - 1E3 * this.totalSeconds / (this.playbackSpeed * this.scenePlaybackSpeed)
    };
    SceneAnimator.prototype.setAnimationProgress = function (a, b) {
        var c = this.animations[this.selectedAnimationIndex];
        this.animationProgress = a;
        this.totalSeconds = c.totalSeconds * this.animationProgress;
        this.totalSeconds -= 1 / c.originalFPS;
        0 > this.totalSeconds && (this.totalSeconds = 0);
        this.startMS = Date.now() - 1E3 * this.totalSeconds / (this.playbackSpeed * this.scenePlaybackSpeed);
        b && this.updateScene()
    };
    SceneAnimator.prototype.setPlaybackSpeed = function (a) {
        this.playbackSpeed = a;
        this.startMS = Date.now() - 1E3 * this.totalSeconds / (this.playbackSpeed * this.scenePlaybackSpeed)
    };
    SceneAnimator.prototype.resetCustomView = function () {
        0 <= this.selectedCameraIndex && this.selectedCameraIndex < this.views.length && (this.viewYawOffsets[this.selectedCameraIndex] = 0, this.viewPitchOffsets[this.selectedCameraIndex] = 0, this.scene.view.rotation[1] = this.views[this.selectedCameraIndex].rotation[1], this.scene.view.rotation[0] = this.views[this.selectedCameraIndex].rotation[0], this.setViewFromSelectedCamera())
    };
    SceneAnimator.prototype.updateUserCamera = function () {
        this.clearCacheForCameraChildren();
        if (0 <= this.selectedCameraIndex && this.selectedCameraIndex < this.views.length && this.selectedAnimationIndex < this.animations.length) {
            var a = this.cameraObjectIndices[this.selectedCameraIndex],
                b = this.animations[this.selectedAnimationIndex];
            if (a < b.animatedObjects.length) {
                var c = this.views[this.selectedCameraIndex],
                    d = this.scene.view.rotation[1],
                    e = this.scene.view.rotation[0],
                    f = e - c.rotation[0];
                this.viewYawOffsets[this.selectedCameraIndex] =
                    d - c.rotation[1];
                this.viewPitchOffsets[this.selectedCameraIndex] = f;
                c = b.animatedObjects[a];
                b.getObjectAnimationFramePercent(c, this.totalSeconds);
                var f = Matrix.identity(),
                    g = Matrix.identity();
                c.useFixedWorldTransform = !1;
                c.useFixedLocalTransform = !1;
                c.animatedLocalTransform.lockTransform = !1;
                c.animatedLocalTransform.clearCachedTransforms();
                c.cachedFrame0 = -1;
                c.cachedFrame1 = -1;
                c.cachedFrame2 = -1;
                c.cachedFrame3 = -1;
                c.cachedFrameUse0 = 0;
                c.cachedFrameUse1 = 0;
                c.cachedFrameUse2 = 0;
                c.cachedFrameUse3 = 0;
                b.getWorldTransform(a,
                    this.totalSeconds, g, this.sceneScale, !1);
                var a = g[0],
                    h = g[1],
                    k = g[2],
                    l = g[4],
                    n = g[5],
                    m = g[6],
                    p = g[8],
                    r = g[9],
                    s = g[10],
                    a = Math.sqrt(a * a + h * h + k * k),
                    l = Math.sqrt(l * l + n * n + m * m),
                    n = Math.sqrt(p * p + r * r + s * s),
                    m = -(this.scene.view.pivot[0] - g[12]),
                    h = -(this.scene.view.pivot[1] - g[13]),
                    g = -(this.scene.view.pivot[2] - g[14]);
                0 >= m * p + h * r + g * s && (d += 180);
                d = Matrix.rotation(Matrix.empty(), d, 1);
                e = Matrix.rotation(Matrix.empty(), e, 0);
                Matrix.mul(f, d, e);
                e = Math.sqrt(m * m + h * h + g * g);
                d = this.scene.view.pivot[1] + f[9] * e;
                g = this.scene.view.pivot[2] + f[10] *
                    e;
                f[12] = this.scene.view.pivot[0] + f[8] * e;
                f[13] = d;
                f[14] = g;
                e = Matrix.identity();
                b.getWorldTransform(c.parentIndex, this.totalSeconds, e, this.sceneScale, !1);
                b = Matrix.identity();
                Matrix.invert(b, e);
                e = Matrix.identity();
                Matrix.mul(e, b, f);
                e[12] /= this.sceneScale;
                e[13] /= this.sceneScale;
                e[14] /= this.sceneScale;
                f[0] *= a;
                f[1] *= a;
                f[2] *= a;
                f[4] *= l;
                f[5] *= l;
                f[6] *= l;
                f[8] *= n;
                f[9] *= n;
                f[10] *= n;
                c.setFixedWorldTransform(f);
                c.setFixedLocalTransform(e)
            }
        }
    };
    SceneAnimator.prototype.setViewFromSelectedCamera = function () {
        if (0 <= this.selectedCameraIndex && this.selectedCameraIndex < this.views.length) {
            var a = this.views[this.selectedCameraIndex],
                b = this.scene.view,
                c = this.viewYawOffsets[this.selectedCameraIndex],
                d = this.viewPitchOffsets[this.selectedCameraIndex];
            b.pivot[0] = a.pivot[0];
            b.pivot[1] = a.pivot[1];
            b.pivot[2] = a.pivot[2];
            b.rotation[0] = a.rotation[0] + d;
            b.rotation[1] = a.rotation[1] + c;
            b.radius = a.radius;
            b.nearPlane = a.nearPlane;
            b.fov = a.fov;
            b.limits = a.limits;
            b.saveResetView();
            b.updateProjection();
            b.updateView()
        }
    };
    SceneAnimator.prototype.selectDefaultCamera = function () {
        if (-1 != this.defaultCameraGlobalIndex && 0 < this.animations.length)
            for (var a = this.animations[0], b = a.cameraObjects.length, c = 0; c < b; c++)
                if (a.cameraObjects[c].id == this.defaultCameraGlobalIndex) {
                    this.selectedCameraIndex = c;
                    return
                } this.selectedCameraIndex = 0
    };
    SceneAnimator.prototype.updateAnimationPlayback = function () {
        if (!this.stopEverything || !this.runDebugMode) {
            var a = this.animations[this.selectedAnimationIndex];
            this.updateUserCamera();
            if (this.paused || !this.playAnimations) this.startMS = 0 < this.playbackSpeed ? Date.now() - 1E3 * this.totalSeconds / (this.playbackSpeed * this.scenePlaybackSpeed) : Date.now() - 1E3 * this.totalSeconds, this.refreshTransformsOnly(), this.runDebugMode && this.checkDebug(), a = this.scene.view, a.saveResetView(), a.updateProjection(), a.updateView();
            else {
                this.lockPlayback &&
                    0 < this.playbackSpeed && (this.startMS = Date.now() - 1E3 * this.totalSeconds / (this.playbackSpeed * this.scenePlaybackSpeed));
                var b = (Date.now() - this.startMS) / 1E3 * this.playbackSpeed * this.scenePlaybackSpeed;
                this.totalSeconds = (Date.now() - this.startMS) / 1E3 * this.playbackSpeed * this.scenePlaybackSpeed;
                var c = b / a.totalSeconds,
                    b = Math.floor(c),
                    c = c - b;
                b != this.loopCount && (this.loopCount++, this.loopTurntables && this.rolloverTurntables(), this.autoAdvanceNextAnimation && (this.nextAnimation(), this.resetPlayback()));
                this.totalSeconds =
                    a.totalSeconds * c;
                this.animationProgress = this.totalSeconds / a.totalSeconds - Math.floor(this.totalSeconds / a.totalSeconds);
                this.updateScene();
                this.runDebugMode && this.checkDebug()
            }
        }
    };
    SceneAnimator.prototype.updateScene = function () {
        this.lastSceneFramePercent = this.totalSeconds * this.animations[this.selectedAnimationIndex].originalFPS;
        0 != this.fogObjectIndex && this.updateFog();
        this.animateTurntables && this.updateTurntables();
        this.animateMeshes && this.poseMeshes();
        this.animateLights && this.updateLights();
        this.animateMaterials && this.updateMaterials();
        this.animateVisibility && this.updateVisibility()
    };
    SceneAnimator.prototype.findCameraChildren = function () {
        for (var a = this.animations[0], b = a.animatedObjects.length, c = 0; c < b; c++) a.hasParentTypeInHierarchy(a.animatedObjects[c], "CameraSO") && this.cameraChildrenIndices.push(c)
    };
    SceneAnimator.prototype.findFixedTransforms = function () {
        for (var a = this.animations.length, b = 0; b < a; b++)
            for (var c = this.animations[b], d = c.animatedObjects.length, e = 0; e < d; e++) {
                var f = c.animatedObjects[e];
                if (!f.useFixedWorldTransform && !c.hasAnimationInHierarchy(f))
                    if ("Material" == f.sceneObjectType) f.setFixedWorldTransform(Matrix.identity()), f.setFixedLocalTransform(Matrix.identity());
                    else {
                        var g = Matrix.identity(),
                            h = Matrix.identity();
                        c.hasParentTypeInHierarchy(f, "SceneRootSO") ? (c.getWorldTransform(f.id, 0, g, this.sceneScale,
                            !1), f.evaluateLocalTransformAtFramePercent(0, h, !0, !1)) : (c.evaluateModelPartTransformAtFrame(f.id, 0, g, !1), f.evaluateLocalTransformAtFramePercent(0, h, !1, !1));
                        f.setFixedWorldTransform(g);
                        f.setFixedLocalTransform(h)
                    }
            }
    };
    SceneAnimator.prototype.clearCacheForCameraChildren = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = this.cameraChildrenIndices.length, c = 0; c < b; c++) {
            var d = a.animatedObjects[this.cameraChildrenIndices[c]];
            d.useFixedWorldTransform = !1;
            d.useFixedLocalTransform = !1;
            d.cachedFrame0 = -10;
            d.cachedFrame1 = -10;
            d.cachedFrame2 = -10;
            d.cachedFrame3 = -10;
            d.cachedFrameUse0 = 0;
            d.cachedFrameUse1 = 0;
            d.cachedFrameUse2 = 0;
            d.cachedFrameUse3 = 0;
            d.animatedLocalTransform.clearCachedTransforms();
            d.animatedLocalTransform.lockTransform = !1
        }
    };
    SceneAnimator.prototype.refreshTransformsOnly = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = a.meshObjects.length, c = 0; c < b; c++) {
            var d = a.meshObjects[c];
            a.getWorldTransform(d.id, this.totalSeconds, d.mesh.displayMatrix, this.sceneScale, !0);
            if (this.enableSkinning && d.skinningRig && this.unitScaleSkinnedMeshes && !d.skinningRig.isRigidSkin) {
                var d = d.mesh.displayMatrix,
                    e = d[0],
                    f = d[1],
                    g = d[2],
                    h = d[4],
                    k = d[5],
                    l = d[6],
                    n = d[8],
                    m = d[9],
                    p = d[10],
                    e = Math.sqrt(e * e + f * f + g * g),
                    h = Math.sqrt(h * h + k * k + l * l),
                    n = Math.sqrt(n * n +
                        m * m + p * p),
                    n = (e + h + n) / 2;
                d[0] /= n;
                d[1] /= n;
                d[2] /= n;
                d[4] /= n;
                d[5] /= n;
                d[6] /= n;
                d[8] /= n;
                d[9] /= n;
                d[10] /= n
            }
        }
        if (this.animateLights)
            for (b = a.lightObjects.length, c = 0; c < b; c++) d = a.lightObjects[c], d.useFixedWorldTransform || (n = this.scene.lights.getLightPos(d.lightIndex), m = this.scene.lights.getLightDir(d.lightIndex), p = Matrix.identity(), a.getWorldTransform(d.id, this.totalSeconds, p, this.sceneScale, !0), m[0] = p[8], m[1] = p[9], m[2] = p[10], 0 != n[3] && (n[0] = p[12], n[1] = p[13], n[2] = p[14], this.scene.lights.setLightPos(d.lightIndex, n)),
                this.scene.lights.setLightDir(d.lightIndex, m))
    };
    SceneAnimator.prototype.findMeshIndexByPartIndex = function (a, b) {
        for (var c = 0; c < this.meshIDs.length; ++c)
            if (b == this.meshIDs[c]) return c;
        return -1
    };
    SceneAnimator.prototype.findLightIndexByPartIndex = function (a) {
        for (var b = 0; b < this.lightIDs.length; b++)
            if (a == this.lightIDs[b]) return b;
        return -1
    };
    SceneAnimator.prototype.findMaterialIndexByPartIndex = function (a) {
        for (var b = 0; b < this.materialIDs.length; b++)
            if (a == this.materialIDs[b]) return b;
        return -1
    };
    SceneAnimator.prototype.nextAnimation = function () {
        this.selectedAnimationIndex++;
        this.selectedAnimationIndex >= this.animations.length && (this.selectedAnimationIndex = 0)
    };
    SceneAnimator.prototype.selectAnimation = function (a) {
        0 <= a && a < this.animations.length && (this.selectedAnimationIndex = a);
        this.paused && this.setAnimationProgress(this.animationProgress, !0)
    };
    SceneAnimator.prototype.selectCamera = function (a) {
        -1 != a && this.selectedCameraIndex != a && (this.selectedCameraIndex = a, this.setViewFromSelectedCamera())
    };
    SceneAnimator.prototype.getAnimatedCamera = function () {
        if (0 <= this.selectedCameraIndex && this.selectedAnimationIndex < this.animations.length) {
            var a = this.animations[this.selectedAnimationIndex];
            if (this.selectedCameraIndex < a.cameraObjects.length) return a.cameraObjects[this.selectedCameraIndex]
        }
    };
    SceneAnimator.prototype.poseMeshes = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = a.meshObjects.length, c = 0; c < b; c++) {
            var d = a.meshObjects[c];
            if (this.enableSkinning && d.skinningRig)
                if (d.skinningRig.isRigidSkin) a.getWorldTransform(d.id, this.totalSeconds, d.mesh.displayMatrix, this.sceneScale, !0);
                else {
                    d.setupSkinningRig(a, d.modelPartIndex, this.totalSeconds, d.skinningRig);
                    a.getWorldTransform(d.id, this.totalSeconds, d.mesh.displayMatrix, this.sceneScale, !0);
                    var e = d.modelPartScale * this.sceneScale;
                    if (this.unitScaleSkinnedMeshes) {
                        var f = d.mesh.displayMatrix,
                            g = f[0],
                            h = f[1],
                            k = f[2],
                            l = f[4],
                            n = f[5],
                            m = f[6],
                            p = f[8],
                            r = f[9],
                            s = f[10],
                            g = Math.sqrt(g * g + h * h + k * k),
                            l = Math.sqrt(l * l + n * n + m * m),
                            p = Math.sqrt(p * p + r * r + s * s),
                            p = (g + l + p) / 2;
                        f[0] /= p;
                        f[1] /= p;
                        f[2] /= p;
                        f[4] /= p;
                        f[5] /= p;
                        f[6] /= p;
                        f[8] /= p;
                        f[9] /= p;
                        f[10] /= p;
                        e *= p
                    }
                    d.skinningRig.deformMesh(d.mesh, e)
                }
            else a.getWorldTransform(d.id, this.totalSeconds, d.mesh.displayMatrix, this.sceneScale, !0)
        }
    };
    SceneAnimator.prototype.updateLights = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = this.totalSeconds * a.originalFPS, c = a.lightObjects.length, d = 0; d < c; d++) {
            var e = a.lightObjects[d],
                f = this.scene.lights.getLightPos(e.lightIndex),
                g = this.scene.lights.getLightDir(e.lightIndex),
                h = this.scene.lights.getLightColor(e.lightIndex),
                k = Matrix.identity(),
                l = 1;
            e.useFixedWorldTransform || a.getWorldTransform(e.id, this.totalSeconds, k, this.sceneScale, !0);
            e.redProperty && (e.redProperty.evaluate(b, h[0], e),
                h[0] = e.redProperty.lastValue);
            e.greenProperty && (e.greenProperty.evaluate(b, h[1], e), h[1] = e.greenProperty.lastValue);
            e.blueProperty && (e.blueProperty.evaluate(b, h[2], e), h[2] = e.blueProperty.lastValue);
            e.brightnessProperty && (e.brightnessProperty.evaluate(b, l, e), l = e.brightnessProperty.lastValue);
            h[0] *= l;
            h[1] *= l;
            h[2] *= l;
            0 != f[3] && (e.useFixedWorldTransform || (f[0] = k[12], f[1] = k[13], f[2] = k[14], this.scene.lights.setLightPos(e.lightIndex, f)), e.spotAngleProperty && 0 < this.scene.lights.spot[3 * e.lightIndex] && (f = 0, e.spotAngleProperty.evaluate(b,
                f, e), f = e.spotAngleProperty.lastValue, this.scene.lights.setLightSpotAngle(e.lightIndex, f)), e.spotSharpnessProperty && (f = 0, e.spotSharpnessProperty.evaluate(b, f, e), f = e.spotSharpnessProperty.lastValue, this.scene.lights.setLightSpotSharpness(e.lightIndex, f)), e.distanceProperty && (f = 1, e.distanceProperty.evaluate(b, f, e), f = e.distanceProperty.lastValue * this.sceneScale, this.scene.lights.setLightDistance(e.lightIndex, f)));
            e.useFixedWorldTransform || (g[0] = k[8], g[1] = k[9], g[2] = k[10], this.scene.lights.setLightDir(e.lightIndex,
                g));
            this.scene.lights.setLightColor(e.lightIndex, h)
        }
    };
    SceneAnimator.prototype.updateTurntables = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = this.totalSeconds * a.originalFPS, c = a.turnTableObjects.length, d = 0; d < c; d++) {
            var e = a.turnTableObjects[d];
            e.spinProperty.evaluate(b, 0, e);
            e.turnTableSpin = e.turnTableSpinOffset + e.spinProperty.lastValue * this.totalSeconds
        }
    };
    SceneAnimator.prototype.rolloverTurntables = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = a.turnTableObjects.length, c = 0; c < b; c++) {
            var d = a.turnTableObjects[c];
            d.turnTableSpinOffset = d.turnTableSpin
        }
    };
    SceneAnimator.prototype.updateMaterials = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = this.totalSeconds * a.originalFPS, c = a.materialObjects.length, d = 0; d < c; d++) {
            var e = a.materialObjects[d];
            e.offsetUProperty && (e.offsetUProperty.evaluate(b, 0, e), this.scene.materialsList[e.materialIndex].uOffset = e.offsetUProperty.lastValue);
            e.offsetVProperty && (e.offsetVProperty.evaluate(b, 0, e), this.scene.materialsList[e.materialIndex].vOffset = e.offsetVProperty.lastValue);
            e.emissiveProperty && 1 < e.emissiveProperty.numKeyframes &&
                (e.emissiveProperty.evaluate(b, 0, e), this.scene.materialsList[e.materialIndex].emissiveIntensity = e.emissiveProperty.lastValue)
        }
    };
    SceneAnimator.prototype.updateFog = function () {
        var a = this.animations[this.selectedAnimationIndex],
            b = this.totalSeconds * a.originalFPS;
        0 <= this.fogObjectIndex && this.fogObjectIndex < a.animatedObjects.length && this.scene.fog && (a = a.animatedObjects[this.fogObjectIndex], a.redProperty && (this.scene.fog.desc.color[0] = a.redProperty.evaluate(b, this.scene.fog.desc.color[0], a)), a.greenProperty && (this.scene.fog.desc.color[1] = a.greenProperty.evaluate(b, this.scene.fog.desc.color[1], a)), a.blueProperty && (this.scene.fog.desc.color[2] =
            a.blueProperty.evaluate(b, this.scene.fog.desc.color[2], a)), a.distanceProperty && (this.scene.fog.desc.distance = a.distanceProperty.evaluate(b, this.scene.fog.desc.distance, a)), a.opacityProperty && (this.scene.fog.desc.opacity = a.opacityProperty.evaluate(b, this.scene.fog.desc.opacity, a)), a.skyIllumProperty && (this.scene.fog.desc.skyIllum = a.skyIllumProperty.evaluate(b, this.scene.fog.desc.skyIllum, a)), a.lightIllumProperty && (this.scene.fog.desc.lightIllum = a.lightIllumProperty.evaluate(b, this.scene.fog.desc.lightIllum,
            a)), a.dispersionProperty && (this.scene.fog.desc.dispersion = a.dispersionProperty.evaluate(b, this.scene.fog.desc.dispersion, a)))
    };
    SceneAnimator.prototype.updateVisibility = function () {
        for (var a = this.animations[this.selectedAnimationIndex], b = this.subMeshObjectIndices.length, c = 0; c < b; c++) {
            var d = this.subMeshLiveIndices[c];
            if (-1 != d) {
                var e = this.subMeshObjectIndices[c],
                    d = this.scene.meshRenderables[d],
                    f = a.getObjectAnimationFramePercent(a.animatedObjects[e], this.totalSeconds);
                d.visible = a.isVisibleAtFramePercent(e, f)
            }
        }
    };

    function Shader(a) {
        this.gl = a;
        this.program = null;
        this.params = {};
        this.samplers = {};
        this.attribs = {}
    }
    Shader.prototype.build = function (a, b) {
        var c = this.gl;
        this.program = c.createProgram();
        this.params = {};
        this.samplers = {};
        this.attribs = {};
        var d = function (a) {
                for (var b = "", c = a.indexOf("\n"), d = 0; - 1 != c;) d++, b += d + ": ", b += a.substring(0, c + 1), a = a.substring(c + 1, a.length), c = a.indexOf("\n");
                console.log(b)
            },
            e = c.createShader(c.VERTEX_SHADER);
        c.shaderSource(e, a);
        c.compileShader(e);
        c.getShaderParameter(e, c.COMPILE_STATUS) || (console.log(c.getShaderInfoLog(e)), marmoset.verboseErrors && d(a));
        c.attachShader(this.program, e);
        e =
            c.createShader(c.FRAGMENT_SHADER);
        c.shaderSource(e, b);
        c.compileShader(e);
        c.getShaderParameter(e, c.COMPILE_STATUS) || (console.log(c.getShaderInfoLog(e)), marmoset.verboseErrors && d(b));
        c.attachShader(this.program, e);
        c.linkProgram(this.program);
        c.getProgramParameter(this.program, c.LINK_STATUS) || console.log(c.getProgramInfoLog(this.program));
        for (var e = c.getProgramParameter(this.program, c.ACTIVE_UNIFORMS), f = 0, d = 0; d < e; ++d) {
            var g = c.getActiveUniform(this.program, d),
                h = g.name,
                k = h.indexOf("[");
            0 <= k && (h = h.substring(0,
                k));
            k = c.getUniformLocation(this.program, g.name);
            g.type == c.SAMPLER_2D || g.type == c.SAMPLER_CUBE ? this.samplers[h] = {
                location: k,
                unit: f++
            } : this.params[h] = k
        }
        e = c.getProgramParameter(this.program, c.ACTIVE_ATTRIBUTES);
        for (d = 0; d < e; ++d) f = c.getActiveAttrib(this.program, d), this.attribs[f.name] = c.getAttribLocation(this.program, f.name)
    };
    Shader.prototype.bind = function () {
        return this.program ? (this.gl.useProgram(this.program), !0) : !1
    };
    Shader.prototype.complete = function () {
        return !!this.program
    };

    function ShaderCache(a) {
        this.gl = a;
        this.cache = []
    }
    ShaderCache.prototype.fromURLs = function (a, b, c) {
        var d = "";
        if (c)
            for (var e = 0; e < c.length; ++e) d = c[e] + "\n" + d;
        c = d + ":" + a + "|" + b;
        e = this.cache[c];
        if (void 0 !== e) return e;
        var f = new Shader(this.gl),
            g = null,
            h = null,
            k = function () {
                null != g && null != h && f.build(g, h)
            };
        this.fetch(a, function (a) {
            g = d + a;
            k()
        });
        this.fetch(b, function (a) {
            h = d + a;
            k()
        });
        return this.cache[c] = f
    };
    ShaderCache.prototype.fetch = function (a, b) {
        "undefined" != typeof ShaderTable ? void 0 !== ShaderTable[a] ? this.resolveIncludes(new String(ShaderTable[a]), b) : b("") : Network.fetchText("src/shader/" + a, function (a) {
            this.resolveIncludes(a, b)
        }.bind(this), function () {
            b("")
        })
    };
    ShaderCache.prototype.resolveIncludes = function (a, b) {
        for (var c = [], d = !0, e = function (a, b, e, f, n) {
                d = !0;
                c.push({
                    offset: n,
                    path: b.slice(1, b.length - 1)
                });
                return ""
            }; d;) d = !1, a = a.replace(/#include\s((<[^>]+>)|("[^"]+"))/, e);
        if (0 < c.length)
            for (var f = c.length, e = 0; e < c.length; ++e) this.fetch(c[e].path, function (d) {
                this.src = d;
                if (0 >= --f) {
                    for (d = c.length - 1; 0 <= d; --d) a = a.substring(0, c[d].offset) + c[d].src + a.substring(c[d].offset);
                    b(a)
                }
            }.bind(c[e]));
        else b(a)
    };

    function ShadowCollector(a, b) {
        this.gl = a;
        this.shadowCount = b;
        this.nativeDepth = !!a.ext.textureDepth;
        this.desc = c;
        c = this.nativeDepth ? ["#define SHADOW_NATIVE_DEPTH"] : [];
        this.shaderSolid = a.shaderCache.fromURLs("shadowvert.glsl", "shadowfrag.glsl", c);
        c.push("#define ALPHA_TEST 1");
        this.shaderAlphaTest = a.shaderCache.fromURLs("shadowvert.glsl", "shadowfrag.glsl", c);
        this.depthTextures = [];
        this.depthTargets = [];
        if (0 < this.shadowCount) {
            var c = {
                width: 2048,
                height: 2048,
                clamp: !0,
                mipmap: !1,
                nofilter: !0
            };
            a.hints.mobile && (c.width =
                c.height = 1536);
            var d = {
                    width: c.width,
                    height: c.height
                },
                e, f;
            this.nativeDepth ? (e = a.DEPTH_COMPONENT, f = a.UNSIGNED_SHORT) : (d.depthBuffer = Framebuffer.createDepthBuffer(a, c.width, c.height), e = a.RGB, f = a.UNSIGNED_BYTE);
            for (var g = 0; g < this.shadowCount; ++g) this.depthTextures[g] = new Texture(a, c), this.depthTextures[g].loadArray(null, e, f), this.nativeDepth ? d.depth = this.depthTextures[g] : d.color0 = this.depthTextures[g], this.depthTargets[g] = new Framebuffer(a, d)
        }
    }
    ShadowCollector.prototype.bindDepthTexture = function (a, b) {
        this.shadowCount > b && this.depthTextures[b].bind(a)
    };
    ShadowCollector.prototype.collect = function (a, b) {
        for (var c = this.gl, d = a.lights, e = d.shadowCount, f = d.modelViewBuffer, g = d.projectionBuffer, h = d.matrix, k = 0 != a.sceneAnimator, l = Matrix.empty(), n = !1, m = 0; m < e; ++m)
            if (d.shadowsNeedUpdate[m]) {
                d.shadowsNeedUpdate[m] = 0;
                n = !0;
                Matrix.mul(l, f.subarray(16 * m, 16 * (m + 1)), h);
                Matrix.mul(l, g.subarray(16 * m, 16 * (m + 1)), l);
                this.depthTargets[m].bind();
                c.clearColor(1, 1, 1, 1);
                c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                var p = this.shaderSolid;
                p.bind();
                c.uniformMatrix4fv(p.params.uViewProjection,
                    !1, l);
                c.uniformMatrix4fv(p.params.uMeshTransform, !1, Matrix.identity());
                for (var r = 0; r < a.meshRenderables.length; ++r) {
                    var s = a.meshRenderables[r],
                        u = s.material;
                    !s.mesh.desc.castShadows || !u.castShadows || 0 < u.shadowAlphaTest || (k && c.uniformMatrix4fv(p.params.uMeshTransform, !1, s.mesh.displayMatrix), s.drawShadow(p.attribs.vPosition))
                }
                p = this.shaderAlphaTest;
                p.bind();
                c.uniformMatrix4fv(p.params.uViewProjection, !1, l);
                c.uniformMatrix4fv(p.params.uMeshTransform, !1, Matrix.identity());
                for (r = 0; r < a.meshRenderables.length; ++r) s =
                    a.meshRenderables[r], u = s.material, s.mesh.desc.castShadows && u.castShadows && 0 < u.shadowAlphaTest && (u.textures.albedo.bind(p.samplers.tAlbedo), k && (c.uniform2f(p.params.uUVOffset, u.uOffset, u.vOffset), c.uniformMatrix4fv(p.params.uMeshTransform, !1, s.mesh.displayMatrix)), s.drawAlphaShadow(p.attribs.vPosition, p.attribs.vTexCoord))
            } n && (b.bind(), c.enable(c.CULL_FACE), c.cullFace(c.BACK))
    };
    ShadowCollector.prototype.complete = function () {
        return this.shaderSolid.complete() && this.shaderAlphaTest.complete()
    };

    function ShadowFloor(a, b, c, d) {
        this.gl = a;
        this.desc = b;
        this.lightCount = d.count;
        this.shadowCount = c.shadowCount;
        b = this.nativeDepth ? ["#define SHADOW_NATIVE_DEPTH"] : [];
        b.push("#define LIGHT_COUNT " + this.lightCount);
        b.push("#define SHADOW_COUNT " + this.shadowCount);
        a.hints.mobile && b.push("#define MOBILE");
        this.shader = a.shaderCache.fromURLs("shadowfloorvert.glsl", "shadowfloorfrag.glsl", b);
        b = new Float32Array([-1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0, -1]);
        this.quadGeom = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER,
            this.quadGeom);
        a.bufferData(a.ARRAY_BUFFER, b, a.STATIC_DRAW);
        a.bindBuffer(a.ARRAY_BUFFER, null)
    }
    ShadowFloor.prototype.draw = function (a) {
        var b = a.view,
            c = a.lights,
            d = a.shadow,
            e = this.gl,
            f = this.shader.params,
            g = this.shader.samplers;
        this.shader.bind();
        b = Matrix.mul(Matrix.empty(), b.projectionMatrix, b.viewMatrix);
        Matrix.mul(b, b, this.desc.transform);
        e.uniformMatrix4fv(f.uModelViewProjectionMatrix, !1, b);
        b = Matrix.mul(Matrix.empty(), c.matrix, this.desc.transform);
        e.uniformMatrix4fv(f.uModelSkyMatrix, !1, b);
        0 < c.count && (e.uniform4fv(f.uLightPositions, c.positionBuffer), e.uniform3fv(f.uLightDirections, c.directionBuffer),
            e.uniform3fv(f.uLightColors, c.colors), e.uniform3fv(f.uLightParams, c.parameters), e.uniform3fv(f.uLightSpot, c.spot), a = 0.392699 * a.postRender.currentSample(), e.uniform2f(f.uShadowKernelRotation, 0.5 * Math.cos(a), 0.5 * Math.sin(a)), 0 < c.shadowCount && (a = d.depthTextures[0].desc.width, e.uniform2f(f.uShadowMapSize, a, 1 / a), e.uniformMatrix4fv(f.uShadowMatrices, !1, c.finalTransformBuffer), e.uniformMatrix4fv(f.uInvShadowMatrices, !1, c.inverseTransformBuffer), e.uniform4fv(f.uShadowTexelPadProjections, c.shadowTexelPadProjections),
                d.bindDepthTexture(g.tDepth0, 0), d.bindDepthTexture(g.tDepth1, 1), d.bindDepthTexture(g.tDepth2, 2)));
        e.uniform3f(f.uShadowCatcherParams, this.desc.simple ? 1 : 0, this.desc.alpha, this.desc.edgeFade);
        e.depthMask(!1);
        e.enable(e.BLEND);
        e.blendFunc(e.ZERO, e.SRC_COLOR);
        c = this.shader.attribs.vPosition;
        e.bindBuffer(e.ARRAY_BUFFER, this.quadGeom);
        e.enableVertexAttribArray(c);
        e.vertexAttribPointer(c, 3, e.FLOAT, !1, 0, 0);
        e.drawArrays(e.TRIANGLES, 0, 6);
        e.disableVertexAttribArray(c);
        e.bindBuffer(e.ARRAY_BUFFER, null);
        e.disable(e.BLEND);
        e.depthMask(!0)
    };
    ShadowFloor.prototype.complete = function () {
        return this.shader.complete()
    };

    function Skin(a) {
        this.numVertices = a.vertexCount;
        this.vertices = new Float32Array(a.vertexCount);
        a.vertexBuffer || (this.numVertices = 0)
    };

    function SkinningCluster() {
        this.associateObjectIndex = this.linkObjectIndex = this.linkMode = 0;
        this.vertexIndices = [];
        this.vertexWeights = [];
        this.matrix = Matrix.identity();
        this.defaultAssociateWorldTransform = this.defaultClusterWorldTransform = this.defaultClusterBaseTransform = 0;
        this.defaultClusterWorldTransformInvert = Matrix.identity();
        this.defaultAssociateWorldTransformInvert = Matrix.identity();
        this.debugString = ""
    }
    SkinningCluster.prototype.solveAdditiveClusterTransform = function (a, b, c) {
        b = Matrix.identity();
        var d = Matrix.identity(),
            e = Matrix.identity();
        Matrix.mul(b, a, this.defaultClusterBaseTransform);
        Matrix.mul(d, this.defaultAssociateWorldTransformInvert, b);
        Matrix.mul(e, this.defaultAssociateWorldTransformInvert, d);
        Matrix.mul(c, this.defaultClusterWorldTransformInvert, e)
    };
    SkinningCluster.prototype.solveSimpleClusterTransform = function (a, b, c) {
        var d = Matrix.identity(),
            e = Matrix.identity();
        Matrix.invert(e, b);
        Matrix.mul(d, e, a);
        Matrix.mul(c, d, this.defaultClusterBaseTransform)
    };
    SkinningCluster.prototype.solveClusterTransformAtFrame = function (a, b, c, d) {
        if (1 == this.linkMode) {
            var e = Matrix.identity();
            b = Matrix.identity();
            a.evaluateModelPartTransformAtFrame(this.linkObjectIndex, c, e, !1);
            a.evaluateModelPartTransformAtFrame(this.associateObjectIndex, c, b, !1);
            this.solveAdditiveClusterTransform(e, b, d)
        } else {
            var e = Matrix.identity(),
                f = Matrix.identity();
            a.evaluateModelPartTransformAtFrame(this.linkObjectIndex, c, e, !1);
            a.evaluateModelPartTransformAtFrame(b, c, f, !1);
            this.solveSimpleClusterTransform(e,
                f, d)
        }
    };

    function SkinningRig(a, b, c) {
        this.debugString = "";
        this.skinningClusters = [];
        this.srcVFile = b.file;
        if (a = a.get(this.srcVFile))
            if (a.data) {
                this.rigByteStream = new ByteStream(a.data);
                a = new Uint32Array(this.rigByteStream.bytes.buffer, 0, this.rigByteStream.bytes.length / 4);
                this.expectedNumClusters = a[0];
                this.expectedNumVertices = a[1];
                this.numClusterLinks = a[2];
                this.originalObjectIndex = a[3];
                this.isRigidSkin = a[4];
                this.tangentMethod = a[5];
                b = 6 + 7 * this.expectedNumClusters;
                for (var d = 0; d < this.expectedNumClusters; d++) {
                    var e =
                        new SkinningCluster;
                    this.skinningClusters.push(e);
                    var f = 6 + 7 * d;
                    e.linkMode = a[f + 1];
                    e.linkObjectIndex = a[f + 2];
                    e.associateObjectIndex = a[f + 3];
                    var g = a[f + 5];
                    e.defaultClusterWorldTransform = c.getMatrix(a[f + 4]);
                    e.defaultClusterBaseTransform = c.getMatrix(g);
                    Matrix.invert(e.defaultClusterWorldTransformInvert, e.defaultClusterWorldTransform);
                    1 == e.linkMode && (e.defaultAssociateWorldTransform = c.getMatrix(a[f + 6]), Matrix.invert(e.defaultAssociateWorldTransformInvert, e.defaultAssociateWorldTransform))
                }
                c = 4 * b;
                b = c + this.expectedNumVertices;
                a = b + 2 * this.numClusterLinks;
                b = new Uint8Array(this.rigByteStream.bytes.subarray(b));
                a = new Uint8Array(this.rigByteStream.bytes.subarray(a));
                this.linkMapCount = new Uint8Array(this.rigByteStream.bytes.buffer, c, this.expectedNumVertices);
                this.linkMapClusterIndices = new Uint16Array(b.buffer);
                this.linkMapWeights = new Float32Array(a.buffer)
            } else this.debugString += "<br>No data in " + this.srcVFile;
        else this.debugString += "<br>Error loading buffer for skinning rig " + this.srcVFile
    }
    SkinningRig.prototype.unpackUnitVectors = function (a, b, c, d) {
        for (var e = 0; e < c; e++) {
            var f = b[d * e],
                g = b[d * e + 1],
                h = 32768 <= g;
            h && (g -= 32768);
            var f = f / 32767.4 * 2 - 1,
                g = g / 32767.4 * 2 - 1,
                k = 1 - (f * f + g * g),
                k = Math.sqrt(k),
                k = isNaN(k) ? 0 : k;
            h && (k = -k);
            a[3 * e] = f;
            a[3 * e + 1] = g;
            a[3 * e + 2] = k
        }
    };
    SkinningRig.prototype.copyOriginalVertices = function (a) {
        if (!this.unTransformedVertices)
            if (this.unTransformedVertices = new Float32Array(3 * a.vertexCount), this.unTransformedNormals = new Float32Array(3 * a.vertexCount), this.unTransformedTangents = new Float32Array(3 * a.vertexCount), this.unTransformedBiTangents = new Float32Array(3 * a.vertexCount), this.skinVertexWeights = new Float32Array(a.vertexCount), this.skinVertexTransform4x3 = new Float32Array(12), a.dynamicVertexData) {
                var b = new Float32Array(a.dynamicVertexData.buffer);
                new Uint8Array(a.dynamicVertexData.buffer);
                var c = 0,
                    d = c,
                    c = c + 12 + 8;
                a.secondaryTexCoord && (c += 8);
                var e = c,
                    f = c += 4,
                    c = c + 4,
                    g = a.stride / 2,
                    c = new Uint8Array(a.dynamicVertexData.subarray(c)),
                    c = new Uint16Array(c.buffer),
                    e = new Uint8Array(a.dynamicVertexData.subarray(e)),
                    e = new Uint16Array(e.buffer),
                    f = new Uint8Array(a.dynamicVertexData.subarray(f)),
                    f = new Uint16Array(f.buffer);
                this.unpackUnitVectors(this.unTransformedNormals, c, a.vertexCount, g);
                this.unpackUnitVectors(this.unTransformedTangents, e, a.vertexCount, g);
                this.unpackUnitVectors(this.unTransformedBiTangents,
                    f, a.vertexCount, g);
                for (g = 0; g < a.vertexCount; g++) f = (a.stride * g + d) / 4, this.unTransformedVertices[3 * g] = b[f], this.unTransformedVertices[3 * g + 1] = b[f + 1], this.unTransformedVertices[3 * g + 2] = b[f + 2]
            } else this.debugString += "<br>Can't init skinning rig - mesh buffer is not dynamic - rigid is " + this.isRigidSkin
    };
    SkinningRig.prototype.useOriginalMeshVertices = function (a) {
        this.isRigidSkin ? this.debugString += "<br>useOriginalMeshVertices for rigid skin?" : this.copyOriginalVertices(a)
    };
    SkinningRig.prototype.deformMeshVertices = function (a, b) {
        if (0 != this.skinningClusters.length && this.unTransformedVertices) {
            var c = a.stride / 4,
                d = new Float32Array(a.dynamicVertexData.buffer),
                e = new Uint16Array(a.dynamicVertexData.buffer);
            new Uint8Array(a.dynamicVertexData.buffer);
            var f;
            f = 20;
            a.secondaryTexCoord && (f += 8);
            var g = f,
                h = f += 4;
            f += 4;
            for (var k = this.unTransformedVertices.length / 3, l = 0, n = 0; n < k; ++n) {
                var m = n,
                    p = (m * a.stride + g) / 2,
                    r = (m * a.stride + h) / 2,
                    s = (m * a.stride + f) / 2,
                    u = this.linkMapCount[m],
                    q = this.skinVertexTransform4x3;
                this.skinVertexWeights[m] = 0;
                q[0] = 0;
                q[1] = 0;
                q[2] = 0;
                q[3] = 0;
                q[4] = 0;
                q[5] = 0;
                q[6] = 0;
                q[7] = 0;
                q[8] = 0;
                q[9] = 0;
                q[10] = 0;
                q[11] = 0;
                var x = this.linkMapWeights[l];
                if (1 == u && 1 == x) {
                    var w = this.linkMapClusterIndices[l],
                        w = this.skinningClusters[w],
                        v = w.matrix;
                    q[0] = v[0];
                    q[1] = v[1];
                    q[2] = v[2];
                    q[3] = v[4];
                    q[4] = v[5];
                    q[5] = v[6];
                    q[6] = v[8];
                    q[7] = v[9];
                    q[8] = v[10];
                    q[9] = v[12];
                    q[10] = v[13];
                    q[11] = v[14];
                    this.skinVertexWeights[m] = 1
                } else
                    for (var t = this.skinVertexWeights[m] = 0; t < u; t++) x = this.linkMapWeights[l + t], w = this.linkMapClusterIndices[l + t], w < this.skinningClusters.length &&
                        (w = this.skinningClusters[w], v = w.matrix, q[0] += x * v[0], q[1] += x * v[1], q[2] += x * v[2], q[3] += x * v[4], q[4] += x * v[5], q[5] += x * v[6], q[6] += x * v[8], q[7] += x * v[9], q[8] += x * v[10], q[9] += x * v[12], q[10] += x * v[13], q[11] += x * v[14], this.skinVertexWeights[m] += x, 1 == w.linkMode && (this.skinVertexWeights[m] = 1));
                l += this.linkMapCount[n];
                if (0 < this.skinVertexWeights[m]) {
                    var y = this.unTransformedVertices[3 * n + 0],
                        E = this.unTransformedVertices[3 * n + 1],
                        F = this.unTransformedVertices[3 * n + 2],
                        A = this.unTransformedNormals[3 * n + 0],
                        B = this.unTransformedNormals[3 *
                            n + 1],
                        z = this.unTransformedNormals[3 * n + 2],
                        w = this.unTransformedTangents[3 * n + 0],
                        v = this.unTransformedTangents[3 * n + 1],
                        C = this.unTransformedTangents[3 * n + 2],
                        u = this.unTransformedBiTangents[3 * n + 0],
                        q = this.unTransformedBiTangents[3 * n + 1],
                        x = this.unTransformedBiTangents[3 * n + 2],
                        t = this.skinVertexTransform4x3,
                        G = 1;
                    0 < this.skinVertexWeights[m] && (G = 1 / this.skinVertexWeights[m]);
                    d[c * n] = G * (y * t[0] + E * t[3] + F * t[6] + t[9]) * b;
                    d[c * n + 1] = G * (y * t[1] + E * t[4] + F * t[7] + t[10]) * b;
                    d[c * n + 2] = G * (y * t[2] + E * t[5] + F * t[8] + t[11]) * b;
                    y = A * t[0] + B * t[3] + z * t[6];
                    m = A * t[1] + B * t[4] + z * t[7];
                    A = A * t[2] + B * t[5] + z * t[8];
                    B = w * t[0] + v * t[3] + C * t[6];
                    z = w * t[1] + v * t[4] + C * t[7];
                    w = w * t[2] + v * t[5] + C * t[8];
                    v = u * t[0] + q * t[3] + x * t[6];
                    C = u * t[1] + q * t[4] + x * t[7];
                    u = u * t[2] + q * t[5] + x * t[8];
                    q = Math.sqrt(y * y + m * m + A * A);
                    y /= q;
                    m /= q;
                    A /= q;
                    q = 32767.4 * (y / 2 + 0.5);
                    x = 32767.4 * (m / 2 + 0.5);
                    0 > A && (x += 32768);
                    e[s] = Math.floor(q);
                    e[s + 1] = Math.floor(x);
                    q = Math.sqrt(B * B + z * z + w * w);
                    B /= q;
                    z /= q;
                    w /= q;
                    q = 32767.4 * (B / 2 + 0.5);
                    x = 32767.4 * (z / 2 + 0.5);
                    0 > w && (x += 32768);
                    e[p] = Math.floor(q);
                    e[p + 1] = Math.floor(x);
                    q = Math.sqrt(v * v + C * C + u * u);
                    v /= q;
                    C /= q;
                    u /= q;
                    q = 32767.4 *
                        (v / 2 + 0.5);
                    x = 32767.4 * (C / 2 + 0.5);
                    0 > u && (x += 32768);
                    e[r] = Math.floor(q);
                    e[r + 1] = Math.floor(x)
                } else y = this.unTransformedVertices[3 * n + 0], E = this.unTransformedVertices[3 * n + 1], F = this.unTransformedVertices[3 * n + 2], d[c * n] = y * b, d[c * n + 1] = E * b, d[c * n + 2] = F * b
            }
        }
    };
    SkinningRig.prototype.deformMesh = function (a, b) {
        if (0 != this.skinningClusters.length && !this.isRigidSkin) {
            this.deformMeshVertices(a, b);
            var c = a.gl;
            c.bindBuffer(c.ARRAY_BUFFER, a.vertexBuffer);
            c.bufferData(c.ARRAY_BUFFER, a.dynamicVertexData, c.DYNAMIC_DRAW);
            c.bindBuffer(c.ARRAY_BUFFER, null)
        }
    };

    function Sky(a, b, c) {
        this.gl = a;
        var d = b.extract("sky.dat") || b.extract("sky.png");
        if (void 0 !== d) {
            this.specularTexture = new Texture(a, {
                width: 256,
                height: 2048,
                clamp: !0
            });
            b = d.data;
            for (var d = d.data.length, e = d / 4, f = new Uint8Array(d), g = 0, h = 0; g < d; ++h) f[g++] = b[h + 2 * e], f[g++] = b[h + e], f[g++] = b[h], f[g++] = b[h + 3 * e];
            this.specularTexture.loadArray(f)
        }
        this.diffuseCoefficients = new Float32Array(c.diffuseCoefficients);
        this.backgroundMode = c.backgroundMode || 0;
        this.backgroundBrightness = c.backgroundBrightness || 1;
        this.backgroundColor =
            new Float32Array(c.backgroundColor);
        if (1 <= this.backgroundMode)
            if (this.backgroundShader = a.shaderCache.fromURLs("skyvert.glsl", 3 == this.backgroundMode ? "skySH.glsl" : "sky.glsl", ["#define SKYMODE " + this.backgroundMode]), this.vertexBuffer = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), c = 1 / 256, b = 0.5 / 256, d = 2.8 * b, e = 0.5 * b, c = new Float32Array([0, 1, 0, 0.49609375 + c, 0.49609375 + c, 1, 0, 0, 0.9921875 + c, 0.49609375 + c, 0, 0, 1, 0.49609375 + c, 0.9921875 + c, -1, 0, 0, 0 + c, 0.49609375 + c, 0, 0, -1, 0.49609375 + c, 0 + c, 0, -1, 0, 0.9921875 +
                    c, 0 + c, 0, -1, 0, 0.9921875 + c, 0.9921875 + c, 0, -1, 0, 0 + c, 0.9921875 + c, 0, -1, 0, 0 + c, 0 + c, d, 1 - d, -d, 0.5 + b, 0.5 - b, d, 1 - d, d, 0.5 + b, 0.5 + b, -d, 1 - d, d, 0.5 - b, 0.5 + b, -d, 1 - d, -d, 0.5 - b, 0.5 - b, -d, 0, -1 + d, 0.5 - b, 0 + c + b, d, 0, -1 + d, 0.5 + b, 0 + c + b, 1 - d, 0, -d, 0.9921875 + c - b, 0.5 - b, 1 - d, 0, d, 0.9921875 + c - b, 0.5 + b, d, 0, 1 - d, 0.5 + b, 0.9921875 + c - b, -d, 0, 1 - d, 0.5 - b, 0.9921875 + c - b, -1 + d, 0, d, 0 + c + b, 0.5 + b, -1 + d, 0, -d, 0 + c + b, 0.5 - b, 1, 0, 0, 0.9921875 + c - e, 0.49609375 + c, 0, 0, 1, 0.49609375 + c, 0.9921875 + c - e, -1, 0, 0, 0 + c + e, 0.49609375 + c, 0, 0, -1, 0.49609375 + c, 0 + c + e, 0, 1, 0, 0.49609375 + c - e, 0.49609375 +
                    c, 0, 1, 0, 0.49609375 + c, 0.49609375 + c - e, 0, 1, 0, 0.49609375 + c + e, 0.49609375 + c, 0, 1, 0, 0.49609375 + c, 0.49609375 + c + e
                ]), a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW), a.bindBuffer(a.ARRAY_BUFFER, null), this.indexBuffer = a.createBuffer(), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), c = new Uint16Array([2, 1, 6, 3, 2, 7, 8, 4, 3, 4, 5, 1, 9, 14, 15, 17, 10, 16, 18, 19, 11, 20, 13, 12, 28, 12, 13, 13, 24, 28, 28, 24, 9, 9, 24, 14, 25, 9, 15, 25, 15, 21, 10, 25, 21, 10, 21, 16, 22, 26, 10, 22, 10, 17, 18, 11, 26, 22, 18, 26, 19, 23, 27, 19, 27, 11, 23, 20, 27, 27, 20, 12]), this.skyIndexCount =
                c.length, a.bufferData(a.ELEMENT_ARRAY_BUFFER, c, a.STATIC_DRAW), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null), 3 == this.backgroundMode)
                for (this.backgroundCoefficients = new Float32Array(this.diffuseCoefficients), g = 0; g < this.backgroundCoefficients.length; ++g) this.backgroundCoefficients[g] *= this.backgroundBrightness;
            else {
                this.backgroundTexture = new Texture(a, {
                    width: 256,
                    height: 256,
                    clamp: !0
                });
                c = !1;
                var k;
                a.ext.textureHalf && a.ext.textureHalfLinear && (this.backgroundTexture.loadArray(null, a.RGB, a.ext.textureHalf.HALF_FLOAT_OES),
                    k = new Framebuffer(a, {
                        color0: this.backgroundTexture
                    }), c = k.valid);
                !c && a.ext.textureFloat && a.ext.textureFloatLinear && !a.hints.mobile && (this.backgroundTexture.loadArray(null, a.RGB, a.FLOAT), k = new Framebuffer(a, {
                    color0: this.backgroundTexture
                }), c = k.valid);
                c || (this.backgroundTexture.loadArray(), k = new Framebuffer(a, {
                    color0: this.backgroundTexture
                }));
                k.bind();
                k = new Shader(a);
                k.build("precision highp float; varying vec2 tc; attribute vec4 p; void main(){ gl_Position=p; tc=vec2(0.5,0.5/8.0)*p.xy+vec2(0.5,6.5/8.0); }",
                    "precision highp float; varying vec2 tc; uniform sampler2D tex; uniform float b; void main(){vec4 s=texture2D(tex,tc); gl_FragColor.xyz=s.xyz*(b*s.w);}");
                k.bind();
                a.uniform1f(k.params.b, 7 * Math.sqrt(this.backgroundBrightness));
                this.specularTexture.bind(k.samplers.tex);
                c = a.createBuffer();
                a.bindBuffer(a.ARRAY_BUFFER, c);
                c = new Float32Array([-1, -1, 0.5, 1, 3, -1, 0.5, 1, -1, 3, 0.5, 1]);
                a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW);
                a.enableVertexAttribArray(k.attribs.p);
                a.vertexAttribPointer(k.attribs.p, 4, a.FLOAT,
                    !1, 0, 0);
                a.drawArrays(a.TRIANGLES, 0, 3);
                a.disableVertexAttribArray(k.attribs.p)
            }
    }
    Sky.prototype.setClearColor = function () {
        if (marmoset.transparentBackground) this.gl.clearColor(0, 0, 0, 0);
        else if (1 > this.backgroundMode) {
            var a = this.backgroundColor;
            this.gl.clearColor(a[0], a[1], a[2], 1)
        } else this.gl.clearColor(0.0582, 0.06772, 0.07805, 1)
    };
    Sky.prototype.draw = function (a) {
        if (1 > this.backgroundMode || marmoset.transparentBackground) return !1;
        if (this.complete()) {
            var b = this.gl,
                c = this.backgroundShader,
                d = a.view,
                e = a.lights.invMatrix;
            c.bind();
            b.uniformMatrix4fv(c.params.uInverseSkyMatrix, !1, e);
            b.uniformMatrix4fv(c.params.uViewProjection, !1, d.viewProjectionMatrix);
            3 == this.backgroundMode ? b.uniform4fv(c.params.uSkyCoefficients, this.backgroundCoefficients) : this.backgroundTexture.bind(c.samplers.tSkyTexture);
            a = 0.07 + 0.94 * (1 - a.stripData.activeFade());
            b.uniform1f(c.params.uAlpha, a);
            b.bindBuffer(b.ARRAY_BUFFER, this.vertexBuffer);
            b.enableVertexAttribArray(c.attribs.vPosition);
            b.vertexAttribPointer(c.attribs.vPosition, 3, b.FLOAT, !1, 20, 0);
            b.enableVertexAttribArray(c.attribs.vTexCoord);
            b.vertexAttribPointer(c.attribs.vTexCoord, 2, b.FLOAT, !1, 20, 12);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            1 > a && (b.enable(b.BLEND), b.blendFunc(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA));
            b.depthMask(!1);
            b.disable(b.DEPTH_TEST);
            b.drawElements(b.TRIANGLES, this.skyIndexCount,
                b.UNSIGNED_SHORT, 0);
            b.enable(b.DEPTH_TEST);
            b.depthMask(!0);
            1 > a && b.disable(b.BLEND);
            b.disableVertexAttribArray(c.attribs.vPosition);
            b.disableVertexAttribArray(c.attribs.vTexCoord)
        }
    };
    Sky.prototype.complete = function () {
        return this.backgroundShader && !this.backgroundShader.complete() ? !1 : this.specularTexture.complete()
    };

    function StripData() {
        this.STRIP_NONE = -2;
        this.STRIP_MENU = -1;
        this.stripCount = 5;
        this.strips = [0, 0, 0, 0, 0];
        this.labels = ["Normals", "Albedo", "Reflectivity", "Gloss", "Topology"];
        this.stripSlant = 0.25;
        this.selectedStrip = this.STRIP_NONE;
        this.animationActive = !1;
        this.timestamp = Date.now();
        this.update(!0)
    }
    StripData.expDecay = function (a, b) {
        return Math.exp(-0.69314718 / a * b)
    };
    StripData.prototype.update = function (a) {
        var b = 0.001 * (Date.now() - this.timestamp);
        this.timestamp = Date.now();
        for (var c = !1, d = 0; d < this.stripCount; ++d) {
            var e = 0,
                e = this.selectedStrip == this.STRIP_MENU ? -0.9 + 0.3 * (d + 1) : 0 > this.selectedStrip || d < this.selectedStrip ? -2 : 2;
            if (a) this.strips[d] = e;
            else {
                var f = e - this.strips[d],
                    f = f * StripData.expDecay(0.05, b);
                this.animationActive && (this.strips[d] = e - f);
                c = c || 0.001 < Math.abs(f)
            }
        }
        this.animationActive = c
    };
    StripData.prototype.active = function () {
        return this.selectedStrip >= this.STRIP_MENU
    };
    StripData.prototype.activeFade = function () {
        var a = (this.strips[this.stripCount - 1] - -2) / (-0.9 + 0.3 * this.stripCount - -2),
            a = 1 < a ? 1 : a;
        return 0 > a ? 0 : a
    };
    StripData.prototype.activeWireframe = function () {
        return this.active() && 0.01 < Math.abs(this.strips[4] - this.strips[3])
    };
    StripData.prototype.toggleMenu = function () {
        this.selectedStrip = this.selectedStrip == this.STRIP_MENU ? this.STRIP_NONE : this.STRIP_MENU
    };
    StripData.prototype.selectStrip = function (a, b) {
        if (this.selectedStrip == this.STRIP_MENU) {
            var c = a + b * this.stripSlant;
            this.selectedStrip = this.STRIP_NONE;
            for (var d = 0; d < this.stripCount; ++d)
                if (c < this.strips[d]) {
                    this.selectedStrip = d;
                    break
                }
        } else this.selectedStrip = this.STRIP_MENU
    };

    function Texture(a, b) {
        this.gl = a;
        this.id = null;
        this.type = a.TEXTURE_2D;
        this.format = a.RGBA;
        this.componentType = a.UNSIGNED_BYTE;
        b = b || {};
        this.desc = {
            width: b.width || 1,
            height: b.height || 1,
            mipmap: b.mipmap,
            clamp: b.clamp,
            mirror: b.mirror,
            aniso: b.aniso,
            nofilter: b.nofilter
        }
    }
    Texture.prototype.loadImage = function (a, b) {
        var c = this.gl;
        a && a.width && a.height && (this.desc.width = a.width, this.desc.height = a.height);
        this.id = c.createTexture();
        c.bindTexture(this.type, this.id);
        this.format = b || c.RGBA;
        this.componentType = c.UNSIGNED_BYTE;
        c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
        c.texImage2D(this.type, 0, this.format, this.format, this.componentType, a);
        this.setParams();
        c.bindTexture(this.type, null)
    };
    Texture.prototype.loadArray = function (a, b, c) {
        var d = this.gl;
        this.id = d.createTexture();
        d.bindTexture(this.type, this.id);
        this.format = b || d.RGBA;
        this.componentType = c || d.UNSIGNED_BYTE;
        d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL, !0);
        d.texImage2D(this.type, 0, this.format, this.desc.width, this.desc.height, 0, this.format, this.componentType, a || null);
        this.setParams();
        d.bindTexture(this.type, null)
    };
    Texture.prototype.setParams = function () {
        var a = this.gl,
            b = function (a) {
                return 0 < a && 0 == (a & a - 1)
            };
        b(this.desc.width) && b(this.desc.height) || (this.desc.clamp = !0, this.desc.mipmap = !1);
        b = !this.desc.nofilter;
        this.desc.mipmap ? (a.generateMipmap(this.type), a.texParameteri(this.type, a.TEXTURE_MIN_FILTER, b ? a.LINEAR_MIPMAP_LINEAR : a.NEAREST_MIPMAP_NEAREST)) : a.texParameteri(this.type, a.TEXTURE_MIN_FILTER, b ? a.LINEAR : a.NEAREST);
        a.texParameteri(this.type, a.TEXTURE_MAG_FILTER, b ? a.LINEAR : a.NEAREST);
        if (this.desc.clamp || this.desc.mirror) b =
            this.desc.clamp ? a.CLAMP_TO_EDGE : a.MIRRORED_REPEAT, a.texParameteri(this.type, a.TEXTURE_WRAP_S, b), a.texParameteri(this.type, a.TEXTURE_WRAP_T, b);
        this.desc.aniso && a.ext.textureAniso && a.texParameteri(this.type, a.ext.textureAniso.TEXTURE_MAX_ANISOTROPY_EXT, this.desc.aniso)
    };
    Texture.prototype.rebuildMips = function () {
        this.desc.mipmap && (this.gl.bindTexture(this.type, this.id), this.gl.generateMipmap(this.type))
    };
    Texture.prototype.copyColorBuffer = function () {
        this.gl.bindTexture(this.type, this.id);
        this.gl.copyTexSubImage2D(this.type, 0, 0, 0, 0, 0, this.desc.width, this.desc.height)
    };
    Texture.prototype.bind = function (a) {
        if (a) {
            var b = this.gl;
            b.uniform1i(a.location, a.unit);
            b.activeTexture(b.TEXTURE0 + a.unit);
            b.bindTexture(this.type, this.id)
        }
    };
    Texture.prototype.destroy = function () {
        this.gl.deleteTexture(this.id);
        this.id = null
    };
    Texture.prototype.complete = function () {
        return !!this.id
    };

    function TextureCache(a) {
        this.gl = a;
        this.cache = []
    }
    TextureCache.prototype.fromURL = function (a, b) {
        var c = this.cache[a];
        if (void 0 !== c) return c;
        var d = new Texture(this.gl, b);
        Network.fetchImage(a, function (a) {
            d.loadImage(a)
        });
        return this.cache[a] = d
    };
    TextureCache.prototype.fromFile = function (a, b) {
        if (!a) return null;
        var c = this.cache[a.name];
        if (void 0 !== c) return c;
        var d = new Texture(this.gl, b);
        this.cache[a.name] = d;
        TextureCache.parseFile(a, function (a) {
            d.loadImage(a);
            TextureCache.closeImage(a)
        });
        return d
    };
    TextureCache.prototype.fromFilesMergeAlpha = function (a, b, c) {
        if (!b) return this.fromFile(a, c);
        var d = a.name + "|" + b.name,
            e = this.cache[d];
        if (void 0 !== e) return e;
        var f = this.gl;
        this.blitShader || (this.blitShader = new Shader(this.gl), this.blitShader.build("precision highp float; varying vec2 c; attribute vec2 pos; void main(){ gl_Position.xy = 2.0*pos-vec2(1.0); gl_Position.zw = vec2(0.5,1.0); c=pos; }", "precision highp float; varying vec2 c; uniform sampler2D tTex; void main(){ gl_FragColor=texture2D(tTex,c).rgbr; }"),
            this.mergeVerts = f.createBuffer(), f.bindBuffer(f.ARRAY_BUFFER, this.mergeVerts), e = new Float32Array([0, 0, 2, 0, 0, 2]), f.bufferData(f.ARRAY_BUFFER, e, f.STATIC_DRAW), f.bindBuffer(f.ARRAY_BUFFER, null));
        var g = function (a) {
                this.blitShader.bind();
                a.bind(this.blitShader.samplers.tTex);
                f.bindBuffer(f.ARRAY_BUFFER, this.mergeVerts);
                f.enableVertexAttribArray(this.blitShader.attribs.pos);
                f.vertexAttribPointer(this.blitShader.attribs.pos, 2, f.FLOAT, !1, 0, 0);
                f.drawArrays(f.TRIANGLES, 0, 3);
                f.disableVertexAttribArray(this.blitShader.attribs.pos);
                f.bindBuffer(f.ARRAY_BUFFER, null)
            }.bind(this),
            h = new Texture(this.gl, c);
        this.cache[d] = h;
        var k = 0,
            l = 0,
            n = function () {
                if (k && l) {
                    var a, b;
                    l.width * l.height > k.width * k.height ? (a = l.width, b = l.height) : (a = k.width, b = k.height);
                    h.desc.width = a;
                    h.desc.height = b;
                    if (a <= f.limits.viewportSizes[0] && b <= f.limits.viewportSizes[1]) {
                        var c = {
                            clamp: !0
                        };
                        k.width == a && k.height == b ? (h.loadImage(k, f.RGBA), a = new Framebuffer(f, {
                            color0: h,
                            ignoreStatus: !0
                        }), TextureCache.closeImage(k)) : (b = new Texture(f, c), b.loadImage(k, f.RGB), TextureCache.closeImage(k),
                            h.loadArray(null), a = new Framebuffer(f, {
                                color0: h,
                                ignoreStatus: !0
                            }), a.bind(), g(b), b.destroy());
                        b = new Texture(f, c);
                        b.loadImage(l, f.RGB);
                        TextureCache.closeImage(l);
                        a.bind();
                        f.colorMask(!1, !1, !1, !0);
                        g(b);
                        f.colorMask(!0, !0, !0, !0);
                        b.destroy();
                        Framebuffer.bindNone(f);
                        h.rebuildMips()
                    } else {
                        c = document.createElement("canvas");
                        c.width = a;
                        c.height = b;
                        var d = c.getContext("2d");
                        d.drawImage(k, 0, 0);
                        TextureCache.closeImage(k);
                        c = d.getImageData(0, 0, a, b);
                        c = new Uint8Array(c.data.buffer, c.data.byteOffset, c.data.length);
                        d.drawImage(l,
                            0, 0);
                        TextureCache.closeImage(l);
                        d = d.getImageData(0, 0, a, b).data;
                        a = a * b * 4;
                        for (b = 0; b < a; b += 4) c[b + 3] = d[b];
                        h.loadArray(c)
                    }
                    TextureCache.closeImage(l)
                }
            }.bind(this);
        TextureCache.parseFile(a, function (a) {
            k = a;
            n()
        });
        TextureCache.parseFile(b, function (a) {
            l = a;
            n()
        });
        return h
    };
    TextureCache.parseFile = function (a, b, c) {
        var d = c || new Image;
        if ("undefined" != typeof URL && "undefined" != typeof URL.createObjectURL) {
            a = new Blob([a.data], {
                type: a.type
            });
            var e = URL.createObjectURL(a);
            d.onload = function () {
                URL.revokeObjectURL(e);
                b && b(d)
            };
            d.src = e
        } else {
            a = new Blob([a.data], {
                type: a.type
            });
            var f = new FileReader;
            f.onload = function (a) {
                d.src = f.result
            };
            d.onload = function () {
                b && b(d)
            };
            f.readAsDataURL(a)
        }
    };
    TextureCache.closeImage = function (a) {
        a && 256 < a.width * a.height && (a.onload = null, a.onerror = null, a.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D")
    };

    function TimelineSlider(a, b) {
        this.name = "none";
        this.debugString = "";
        this.knobControlRect = new ControlRect(a);
        this.controlRect = new ControlRect(a);
        var c = document.createElement("div");
        c.id = "sliderUI";
        c.style.position = "absolute";
        c.style.overflow = "hidden";
        c.style["-moz-user-select"] = "none";
        c.style["-khtml-user-select"] = "none";
        c.style["-webkit-user-select"] = "none";
        c.style["-ms-user-select"] = "none";
        this.controlRect.linkedControl = c;
        this.backgroundControl = 0;
        this.controlRect.registerChildControlRect(this.knobControlRect);
        this.knobControlRect.setOpacity(0.65);
        this.sliderPercent = this.pixelsY = this.pixelsX = 0;
        this.draggingSlider = !1;
        this.guiScreen = a;
        b.addImageElement(this.knobControlRect, "animationknob" + a.imageSetNumber + "x.png")
    }
    TimelineSlider.prototype.setBackground3x1 = function (a, b, c, d) {
        var e = 8 / this.controlRect.getScreenHeight();
        this.backgroundControl = a.addTextButton("", 0, (1 - e) / 2, 1, e, 1);
        this.backgroundControl.defaultAlpha = 1;
        this.backgroundControl.setBackground3x1(a, 0, 0, b, c, d, 4);
        this.backgroundControl.controlRect.xPercent = this.controlRect.xPercent;
        this.backgroundControl.controlRect.widthPercent = this.controlRect.widthPercent;
        this.controlRect.linkedControl.style.zIndex = "3";
        this.setupCallbacks()
    };
    TimelineSlider.prototype.setSize = function (a, b) {
        this.pixelsX = a;
        this.pixelsY = b;
        var c = 24 / b;
        this.knobWidthPercent = 24 / a;
        this.knobControlRect.xPercent = 0.5 - this.knobWidthPercent / 2;
        this.knobControlRect.yPercent = (1 - c) / 2 + -1 / b;
        this.knobControlRect.widthPercent = this.knobWidthPercent;
        this.knobControlRect.heightPercent = c;
        this.controlRect.updateElement();
        this.backgroundControl.controlRect.xPercent = this.controlRect.xPercent;
        this.backgroundControl.controlRect.widthPercent = this.controlRect.widthPercent;
        this.backgroundControl.controlRect.updateElement()
    };
    TimelineSlider.prototype.setSliderPercent = function (a) {
        0 > a && (a = 0);
        1 < a && (a = 1);
        this.sliderPercent = a;
        this.knobControlRect.xPercent = a - this.knobWidthPercent / 2;
        this.knobControlRect.updateElement()
    };
    TimelineSlider.prototype.setupCallbacks = function () {
        var a = function (a) {
                if (this.draggingSlider) {
                    var b = this.backgroundControl.controlRect.linkedControl.getBoundingClientRect();
                    this.setSliderPercent((a.clientX - b.left) / b.width);
                    this.guiScreen.ui.viewer.scene.sceneAnimator.setAnimationProgress(this.sliderPercent, !0);
                    this.guiScreen.ui.viewer.scene.sceneAnimator.paused && (this.guiScreen.ui.viewer.scene.postRender.discardAAHistory(), this.guiScreen.ui.viewer.reDrawScene())
                }
            }.bind(this),
            b = function (a) {
                this.draggingSlider = !0;
                var b = this.backgroundControl.controlRect.linkedControl.getBoundingClientRect();
                this.setSliderPercent((a.clientX - b.left) / b.width);
                this.guiScreen.ui.viewer.scene.sceneAnimator.setAnimationProgress(this.sliderPercent, !0);
                this.guiScreen.ui.viewer.scene.sceneAnimator.lockPlayback = !0;
                this.guiScreen.ui.viewer.scene.sceneAnimator.paused && (this.guiScreen.ui.viewer.scene.postRender.discardAAHistory(), this.guiScreen.ui.viewer.reDrawScene())
            }.bind(this),
            c = function (a) {
                this.draggingSlider = !1;
                this.guiScreen.ui.viewer.scene.sceneAnimator.lockPlayback = !1
            }.bind(this);
        this.guiScreen.ui.viewer.input.element.addEventListener("mousemove", a);
        this.guiScreen.ui.viewer.input.element.addEventListener("mouseup", c);
        this.backgroundControl.controlRect.linkedControl.addEventListener("mousemove", a);
        this.backgroundControl.controlRect.linkedControl.addEventListener("mousedown", b);
        this.backgroundControl.controlRect.linkedControl.addEventListener("mouseup", c);
        this.controlRect.linkedControl.addEventListener("mouseup", c)
    };

    function UI(a) {
        this.viewer = a;
        this.stripData = a.stripData;
        a = this.container = document.createElement("div");
        a.id = "marmosetUI";
        a.style.position = "absolute";
        a.style.overflow = "hidden";
        a.style["-moz-user-select"] = "none";
        a.style["-khtml-user-select"] = "none";
        a.style["-webkit-user-select"] = "none";
        a.style["-ms-user-select"] = "none";
        this.viewer.domRoot.appendChild(a);
        this.guiScreen = new GUIScreen(this)
    }
    UI.prototype.setSize = function (a, b) {
        this.container.width = a | 0;
        this.container.height = b | 0;
        this.container.style.width = a + "px";
        this.container.style.height = b + "px";
        this.guiScreen.setSize(this.container.width, this.container.height)
    };
    UI.prototype.clearView = function () {
        for (; this.container.hasChildNodes();) this.container.removeChild(this.container.childNodes[0]);
        delete this.progressBar;
        delete this.thumbnail;
        delete this.fadeThumbnail;
        delete this.playButton;
        delete this.helpOverlay
    };
    UI.prototype.bindInput = function (a) {
        a.onSingleTap.push(function (b, c) {
            this.stripData.selectedStrip != this.stripData.STRIP_NONE && (b = 2 / a.element.clientWidth * b - 1, c = 1 - 2 / a.element.clientHeight * c, this.stripData.selectStrip(b, c), this.stripData.selectedStrip == this.stripData.STRIP_MENU && this.helpOverlay.active && this.helpOverlay.toggle(), this.refreshUI(), this.viewer.wake())
        }.bind(this))
    };
    UI.sanitize = function (a) {
        return a ? a.replace(/<|>|\(|\)|$|%|=/g, "") : a
    };
    UI.sanitizeURL = function (a) {
        return a ? 0 == a.indexOf("http://") || 0 == a.indexOf("https://") || 0 == a.indexOf("ftp://") ? encodeURI(a) : "http://" + encodeURI(a) : a
    };
    UI.prototype.showFailure = function (a) {
        this.container.innerHTML = '<br><br><br><p style="text-align:center;color:#aaaaaa"><b>Marmoset Viewer could not initialize.</b><br><i>' + (a || "") + "</i>"
    };
    UI.prototype.showPreview = function (a) {
        this.clearView();
        this.thumbnail = document.createElement("canvas");
        var b = this.container.width / this.container.height;
        this.thumbnail.height = this.viewer.mobile ? 200 : 300;
        this.thumbnail.width = this.thumbnail.height * b | 0;
        this.thumbnail.style.width = this.thumbnail.style.height = "100%";
        var b = this.thumbnail.getContext("2d"),
            c = b.fillStyle = b.createRadialGradient(this.thumbnail.width / 2, this.thumbnail.height / 2, (this.thumbnail.width + this.thumbnail.height) / 2, this.thumbnail.width / 2,
                0, 0);
        c.addColorStop(0, "rgb(0,0,0)");
        c.addColorStop(1, "rgb(150,150,150)");
        b.fillStyle = c;
        b.fillRect(0, 0, this.thumbnail.width, this.thumbnail.height);
        this.container.appendChild(this.thumbnail);
        this.playButton = document.createElement("input");
        this.playButton.type = "image";
        this.playButton.src = marmoset.dataLocale + "play.png";
        this.playButton.style.position = "absolute";
        this.playButton.style.left = "50%";
        this.playButton.style.top = "50%";
        this.playButton.style["-webkit-transform"] = this.playButton.style.transform = "translate(-50%,-50%) scale(0.5,0.5)";
        this.playButton.style.opacity = 0.5;
        this.playButton.style.outline = "0px";
        this.playButton.onclick = function () {
            this.viewer.loadScene(this.viewer.sceneURL);
            this.container.removeChild(this.playButton);
            delete this.playButton
        }.bind(this);
        this.container.appendChild(this.playButton);
        a || fetchThumbnail(this.viewer.sceneURL, function (a) {
            this.loadingImageURL || this.setThumbnail(a)
        }.bind(this))
    };
    UI.prototype.setThumbnailURL = function (a) {
        (this.loadingImageURL = a) && Network.fetchImage(this.loadingImageURL, this.setThumbnail.bind(this))
    };
    UI.prototype.setThumbnail = function (a) {
        if (this.thumbnail)
            if (a.height >= this.container.height) {
                var b = this.container.height / a.height;
                a.style.position = "absolute";
                a.style.outline = "0px";
                a.style.left = "50%";
                a.style.top = "50%";
                a.style["-webkit-transform"] = a.style.transform = "translate(-50%,-50%) scale(" + b + "," + b + ")";
                this.container.replaceChild(a, this.thumbnail);
                this.thumbnail = a
            } else {
                var c = this.thumbnail.getContext("2d"),
                    d = this.thumbnail.width,
                    e = this.thumbnail.height,
                    b = e / a.height;
                c.drawImage(a, (d - a.width * b) / 2,
                    0, a.width * b, e);
                var f;
                try {
                    f = c.getImageData(0, 0, d, e)
                } catch (g) {
                    return
                }
                a = c.createImageData(d, e);
                for (var h = 0; 2 > h; ++h) {
                    for (var b = f.data, k = a.data, l = 0, n = 0; n < e; ++n)
                        for (var m = 0; m < d; ++m) {
                            for (var p = 0, r = 0, s = 0, u = -2; 2 >= u; ++u)
                                for (var q = n + u, q = 0 > q ? 0 : q >= e ? e - 1 : q, x = -2; 2 >= x; ++x) var w = m + x,
                                    w = 0 > w ? 0 : w >= d ? d - 1 : w,
                                    w = 4 * (q * d + w),
                                    p = p + b[w],
                                    r = r + b[w + 1],
                                    s = s + b[w + 2];
                            k[l++] = p / 25;
                            k[l++] = r / 25;
                            k[l++] = s / 25;
                            k[l++] = 255
                        }
                    b = f;
                    f = a;
                    a = b
                }
                c.putImageData(f, 0, 0)
            }
    };
    UI.prototype.showActiveView = function () {
        var a = this.thumbnail;
        this.clearView();
        a && (this.fadeThumbnail = a, this.fadeThumbnail.style.opacity = 1, this.container.appendChild(this.fadeThumbnail));
        if (!marmoset.noUserInterface) {
            void 0 === marmoset.largeUI && (marmoset.largeUI = this.viewer.mobile);
            450 > this.container.width && (marmoset.largeUI = !1);
            var b = FullScreen.support(),
                b = !0,
                a = 1;
            window.devicePixelRatio && (2 < window.devicePixelRatio ? a = 4 : 1 < window.devicePixelRatio && (a = 2));
            marmoset.largeUI && 4 > a && (a *= 2);
            var c = marmoset.largeUI ?
                0.3 : 0.5;
            this.stripText = [];
            for (var d = 0; d < this.stripData.labels.length; ++d) {
                this.stripText[d] = document.createElement("div");
                this.stripText[d].style.position = "absolute";
                this.stripText[d].style.cursor = "pointer";
                this.stripText[d].style.pointerEvents = "none";
                this.container.appendChild(this.stripText[d]);
                var e = document.createElement("div");
                e.style.color = "white";
                e.style.opacity = 0.5;
                e.style.fontFamily = "Arial";
                e.style.textShadow = "2px 2px 3px #000000";
                e.innerHTML = this.stripData.labels[d];
                this.stripText[d].appendChild(e);
                this.stripText[d].txt = e;
                e = document.createElement("div");
                e.style.width = "10000px";
                e.style.height = "2px";
                e.style.backgroundColor = "#AAAAAA";
                e.style.opacity = 1;
                e.style.position = "absolute";
                e.style.left = e.style.top = "-1px";
                this.stripText[d].appendChild(e);
                this.stripText[d].line = e
            }
            this.sigCluster = document.createElement("div");
            this.sigCluster.style.position = "absolute";
            this.sigCluster.style.right = marmoset.largeUI ? "12px" : "9px";
            this.sigCluster.style.left = "0px";
            this.sigCluster.style.top = "6px";
            this.sigCluster.style.height =
                marmoset.largeUI ? "64px" : "32px";
            this.logo = document.createElement("div");
            this.logo.style.position = "absolute";
            this.logo.style.right = marmoset.largeUI ? "-4px" : "1px";
            this.logo.style.top = marmoset.largeUI ? "0px" : "4px";
            this.logo.title = "Made with Marmoset Toolbag";
            var f = document.createElement("input");
            f.type = "image";
            f.src = marmoset.dataLocale + "logo" + a + "x.png";
            f.style.border = "none";
            f.style.width = f.style.height = marmoset.largeUI ? "72px" : "36px";
            f.style.border = "0px";
            f.style.outline = "0px";
            f.style.opacity = c;
            f.onmouseover =
                function () {
                    this.style.opacity = 1
                }.bind(f);
            f.onmouseout = function () {
                this.style.opacity = c
            }.bind(f);
            f.onclick = function (a) {
                window.open("http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer", "_blank");
                this.style.opacity = c
            }.bind(f, this);
            d = new XMLHttpRequest;
            d.open("HEAD", f.src, !0);
            d.onload = function (a) {
                this.logo.appendChild(a)
            }.bind(this, f);
            d.send();
            this.sigCluster.appendChild(this.logo);
            d = this.viewer.scene.metaData;
            d.title = UI.sanitize(d.title);
            d.subtitle = UI.sanitize(d.subtitle);
            d.author = UI.sanitize(d.author);
            d.link = UI.sanitizeURL(d.link);
            var g = d.title && 0 < d.title.length,
                e = d.subtitle && 0 < d.subtitle.length,
                f = d.author && 0 < d.author.length,
                h = d.link && 0 < d.link.length;
            if (g || e || f) {
                g || (d.title = "Art");
                var k = !g && !e,
                    l = document.createElement("div");
                l.style.position = "absolute";
                l.style.right = marmoset.largeUI ? "74px" : "46px";
                l.style.top = "5px";
                l.style.width = "1px";
                l.style.height = marmoset.largeUI ? k ? "21px" : "35px" : k ? "18px" : "31px";
                l.style.opacity = 0.25;
                l.style.backgroundColor = "white";
                this.sigCluster.appendChild(l);
                this.sigCluster.line = l;
                k = document.createElement("a");
                h && (k.href = d.link);
                k.style.position = "absolute";
                k.style.right = marmoset.largeUI ? "86px" : "58px";
                k.style.top = "6px";
                k.style.textAlign = "right";
                k.style.color = "white";
                k.style.fontFamily = "Arial";
                k.style.fontSize = marmoset.largeUI ? "14px" : "12px";
                k.style.textDecoration = "none";
                k.target = "_blank";
                l = document.createElement("font");
                l.style.color = "#FFFFFF";
                l.style.opacity = 0.5;
                l.style.textDecoration = "none";
                l.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
                l.innerHTML =
                    d.title;
                f && (l.innerHTML = g && !e ? l.innerHTML + "<br>by " : l.innerHTML + " by ");
                k.appendChild(l);
                g = document.createElement("font");
                g.style.color = "#FF0044";
                g.style.opacity = 1;
                g.style.textShadow = "1px 1px 2px rgba(0,0,0,0.35)";
                g.innerHTML = d.author;
                k.appendChild(g);
                f = document.createElement("font");
                f.style.color = "#FFFFFF";
                f.style.opacity = 0.5;
                f.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
                e && (f.innerHTML = "<br>", f.innerHTML += d.subtitle);
                k.appendChild(f);
                h && (k.onmouseover = function (a, b, c) {
                    a.style.opacity = c.style.opacity =
                        1;
                    b.style.textDecoration = "underline"
                }.bind(k, l, g, f), k.onmouseout = function (a, b, c) {
                    a.style.opacity = c.style.opacity = 0.5;
                    b.style.textDecoration = "none"
                }.bind(k, l, g, f));
                this.sigCluster.appendChild(k);
                this.sigCluster.sceneTitle = k
            }
            this.container.appendChild(this.sigCluster);
            this.sigCluster.active = !0;
            this.sigCluster.toggle = function () {
                this.sceneTitle && this.line && (this.active ? (this.removeChild(this.sceneTitle), this.removeChild(this.line)) : (this.appendChild(this.sceneTitle), this.appendChild(this.line)));
                this.active = !this.active
            }.bind(this.sigCluster);
            this.helpOverlay = document.createElement("div");
            this.helpOverlay.style.pointerEvents = "none";
            this.container.appendChild(this.helpOverlay);
            this.hideSigOnHelp = d = 450 > this.container.width;
            this.hideSigOnStrips = !0;
            g = [8, 8];
            d ? (e = 198 + 2 * g[0], f = 258 + 2 * g[1]) : (e = 354 + 2 * g[0], f = 218 + 2 * g[1]);
            h = document.createElement("div");
            h.style.position = "absolute";
            h.style.width = h.style.height = "100%";
            this.helpOverlay.contents = h;
            h = document.createElement("div");
            h.style.position = "absolute";
            h.style.right =
                marmoset.largeUI ? "92px" : "54px";
            h.style.top = d ? "16px" : "48px";
            h.style.width = e + "px";
            h.style.height = f + "px";
            this.helpOverlay.contents.appendChild(h);
            f = document.createElement("div");
            f.style.position = "absolute";
            f.style.width = "100%";
            f.style.height = "100%";
            f.style.backgroundColor = "black";
            f.style.opacity = "0.65";
            f.style.borderRadius = "16px";
            h.appendChild(f);
            f = document.createElement("input");
            f.type = "button";
            f.value = "x";
            f.style.position = "absolute";
            f.style.color = "#FFFFFF";
            f.style.fontWeight = "bolder";
            f.style.backgroundColor =
                "rgba(0,0,0,0.0)";
            f.style.border = "0px";
            f.style.outline = "0px";
            f.style.fontSize = marmoset.largeUI ? "16pt" : "10pt";
            f.style.right = marmoset.largeUI ? "2px" : "8px";
            f.style.top = marmoset.largeUI ? "0px" : "4px";
            f.style.width = f.style.height = marmoset.largeUI ? "32px" : "16px";
            f.style.pointerEvents = "auto";
            f.style.cursor = "pointer";
            f.onclick = function (a) {
                this.helpOverlay.toggle();
                this.refreshUI()
            }.bind(this, f);
            h.appendChild(f);
            f = document.createElement("center");
            f.style.position = "absolute";
            f.style.left = g[0] - 4 + "px";
            f.style.right =
                g[0] + 4 + "px";
            f.style.top = f.style.bottom = g[1] + "px";
            f.style.paddingTop = "8px";
            d || (f.style.paddingRight = "8px");
            h.appendChild(f);
            h = f;
            g = (this.viewer.mobile ? "M" : "PC") + (2 < a ? 4 : 2) + "x.png";
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helprotate" + g;
            f.style.width = "66px";
            f.style.height = "90px";
            h.appendChild(f);
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helpzoom" + g;
            f.style.width = "66px";
            f.style.height = "90px";
            h.appendChild(f);
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helpmove" +
                g;
            f.style.width = "66px";
            f.style.height = "90px";
            h.appendChild(f);
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helpreset" + g;
            f.style.width = "66px";
            f.style.height = "90px";
            h.appendChild(f);
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helplights" + g;
            f.style.position = "relative";
            d || (f.style.left = "8px");
            f.style.width = "66px";
            f.style.height = "90px";
            h.appendChild(f);
            g = document.createElement("a");
            g.href = "http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer";
            g.target = "_blank";
            g.style.pointerEvents = "auto";
            h.appendChild(g);
            k = document.createElement("img");
            k.src = marmoset.dataLocale + "helpshadow.png";
            k.style.position = "absolute";
            k.style.left = 0.5 * e - (d ? 65 : 116) + "px";
            k.style.bottom = d ? "6px" : "8px";
            k.style.width = d ? "116px" : "232px";
            k.style.opacity = 0;
            g.appendChild(k);
            k.targetOpacity = 0;
            g.onmouseover = function () {
                this.targetOpacity = 0.65
            }.bind(k);
            g.onmouseout = function () {
                this.targetOpacity = 0
            }.bind(k);
            window.setInterval(function () {
                this.style.opacity = 0.1 * this.targetOpacity + 0.9 *
                    this.style.opacity
            }.bind(k), 20);
            f = document.createElement("img");
            f.src = marmoset.dataLocale + "helptitle.png";
            f.style.position = "absolute";
            f.style.left = 0.5 * e - (d ? 65 : 116) + "px";
            f.style.bottom = d ? "8px" : "12px";
            f.style.width = d ? "116px" : "232px";
            g.appendChild(f);
            e = document.createElement("div");
            e.style.position = "absolute";
            e.style.left = 0;
            e.style.right = d ? "30px" : "108px";
            e.style.bottom = d ? "-4px" : "4px";
            e.style.textAlign = "right";
            e.style.fontFamilly = "Arial";
            h.appendChild(e);
            d = document.createElement("font");
            d.style.fontSize =
                "9pt";
            d.style.fontFamily = "Arial";
            e.appendChild(d);
            g = document.createElement("a");
            g.style.color = "#FF0044";
            g.style.textDecoration = "none";
            g.style.pointerEvents = "auto";
            g.innerHTML = "www.marmoset.co/viewer";
            g.href = "http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer";
            g.target = "_blank";
            g.onmouseover = function (a) {
                this.style.textDecoration = "underline";
                a.targetOpacity = 0.65
            }.bind(g, k);
            g.onmouseout = function (a) {
                this.style.textDecoration = "none";
                a.targetOpacity = 0
            }.bind(g, k);
            d.appendChild(g);
            this.helpOverlay.active = !1;
            this.helpOverlay.toggle = function (a) {
                this.active ? this.removeChild(this.contents) : this.appendChild(this.contents);
                this.active = !this.active
            }.bind(this.helpOverlay, this.viewer);
            this.menuCluster = document.createElement("div");
            this.menuCluster.style.position = "absolute";
            this.menuCluster.style.right = marmoset.largeUI ? "4px" : "8px";
            this.menuCluster.style.top = marmoset.largeUI ? "70px" : "40px";
            marmoset.largeUI ? (this.menuCluster.style.width = "72px", this.menuCluster.style.height = "64px") : (this.menuCluster.style.width =
                "36px", this.menuCluster.style.height = "36px");
            h = document.createElement("div");
            h.style.left = h.style.top = "0px";
            h.style.width = h.style.height = "100%";
            this.menuCluster.contents = h;
            this.menuCluster.appendChild(h);
            d = 0;
            e = function (a, b, c, d, e) {
                var f = document.createElement("input");
                f.type = "image";
                f.src = marmoset.dataLocale + c;
                f.style.position = "absolute";
                f.style.left = "0px";
                f.style.bottom = -100 * d + "%";
                f.style.border = "none";
                f.style.outline = "0px";
                f.title = b;
                f.style.opacity = e;
                marmoset.largeUI ? (f.style.width = "64px", f.style.height =
                    "48px") : (f.style.width = "32px", f.style.height = "24px");
                f.onmouseover = function (a) {
                    this.style.opacity = a
                }.bind(f, 1);
                f.onmouseout = function (a) {
                    this.style.opacity = a
                }.bind(f, e);
                f.onmouseup = function (a) {
                    this.style.opacity = a
                }.bind(f, e);
                b = new XMLHttpRequest;
                b.open("HEAD", f.src, !0);
                b.onload = function (a) {
                    a.appendChild(this)
                }.bind(f, a);
                b.send();
                return f
            };
            b && (b = e(this.menuCluster.contents, "Full Screen", "fullscreen" + a + "x.png", d++, c), b.onclick = function (a) {
                FullScreen.active() ? FullScreen.end() : FullScreen.begin(this.viewer.domRoot,
                    this.viewer.fullscreenChange.bind(this.viewer));
                a.style.opacity = c;
                this.refreshUI()
            }.bind(this, b));
            b = e(this.menuCluster.contents, "Layer Views", "strips" + a + "x.png", d++, c);
            b.onclick = function (a) {
                this.stripData.toggleMenu();
                this.helpOverlay.active && this.helpOverlay.toggle();
                this.viewer.wake();
                this.refreshUI()
            }.bind(this, b);
            b = e(this.menuCluster.contents, "Help", "help" + a + "x.png", d++, c);
            b.onclick = function (a) {
                this.stripData.selectedStrip == this.stripData.STRIP_MENU && this.stripData.toggleMenu();
                this.helpOverlay.toggle();
                this.refreshUI()
            }.bind(this, b);
            this.guiScreen && this.guiScreen.setupActiveView(this);
            this.container.appendChild(this.menuCluster);
            this.menuCluster.active = !0;
            this.menuCluster.toggle = function () {
                this.active ? this.removeChild(this.contents) : this.appendChild(this.contents);
                this.active = !this.active
            }.bind(this.menuCluster);
            void 0 !== marmoset.hostImage && (marmoset.hostURL && (g = document.createElement("a"), g.href = marmoset.hostURL, g.target = "_blank"), f = document.createElement("img"), f.src = marmoset.hostImage, f.style.position =
                "absolute", f.style.top = "4px", f.style.left = "4px", f.style.opacity = 0.65, f.style["-webkit-transform"] = f.style.transform = "translate(-50%,-50%) scale(0.5,0.5) translate(50%,50%)", marmoset.hostURL ? (f.onmouseover = function () {
                    this.style.opacity = 1
                }.bind(f), f.onmouseout = function () {
                    this.style.opacity = 0.5
                }.bind(f), g.appendChild(f), this.hostLogo = g) : this.hostLogo = f, d = new XMLHttpRequest, d.open("HEAD", f.src, !0), d.onload = function () {
                    this.container.appendChild(this.hostLogo)
                }.bind(this), d.send());
            this.sceneStats = document.createElement("text");
            this.sceneStats.style.position = "absolute";
            this.sceneStats.style.left = "9px";
            this.sceneStats.style.bottom = "8px";
            this.sceneStats.style.color = "gray";
            this.sceneStats.style.fontFamily = "Arial";
            this.sceneStats.style.fontSize = "75%";
            for (d = b = a = 0; d < this.viewer.scene.meshes.length; ++d) e = this.viewer.scene.meshes[d], a += e.indexCount / 3, b += e.vertexCount;
            this.sceneStats.innerHTML = "Triangles: " + (a | 0).toLocaleString() + "<br>Vertices: " + (b | 0).toLocaleString();
            marmoset.showFrameTime && (this.frameTimer = document.createElement("text"),
                this.frameTimer.style.position = "absolute", this.frameTimer.style.left = this.frameTimer.style.top = "5px", this.frameTimer.style.color = "gray", this.frameTimer.style.fontSize = "75%", this.container.appendChild(this.frameTimer), this.frameTimer.innerHTML = "--", this.frameCount = 1E20);
            this.animateStrips()
        }
    };
    UI.prototype.refreshUI = function () {
        if (this.sigCluster) {
            var a = !1,
                b = this.stripData.selectedStrip == this.stripData.STRIP_MENU;
            this.hideSigOnStrips && (a = a || b);
            this.hideSigOnHelp && (a = a || this.helpOverlay.active);
            this.sigCluster.active == a && this.sigCluster.toggle()
        }
    };
    UI.prototype.signalLoadProgress = function (a, b) {
        if (this.thumbnail) {
            if (!this.progressBar) {
                var c = document.createElement("div");
                c.style.backgroundColor = "rgb(30,30,30)";
                c.style.opacity = 0.5;
                c.style.position = "absolute";
                c.style.left = "20%";
                c.style.width = "60%";
                c.style.bottom = "30%";
                c.style.height = "2px";
                this.progressBar = document.createElement("div");
                this.progressBar.style.backgroundColor = "white";
                this.progressBar.style.position = "absolute";
                this.progressBar.style.left = this.progressBar.style.bottom = "0px";
                this.progressBar.style.height =
                    "100%";
                this.progressBar.style.width = "0px";
                c.appendChild(this.progressBar);
                this.container.appendChild(c);
                this.playButton && (this.container.removeChild(this.playButton), delete this.playButton)
            }
            this.progressBar.style.width = 0 >= b ? (100 * a / (2097152 + a) | 0) + "%" : (100 * a / b | 0) + "%"
        }
    };
    UI.prototype.animating = function () {
        return !!this.fadeThumbnail || !!this.frameTimer
    };
    UI.prototype.animate = function () {
        this.fadeThumbnail && (this.fadeThumbnailTimer = this.fadeThumbnailTimer || Date.now(), this.fadeThumbnail.style.opacity = 1 - 0.0015 * (Date.now() - this.fadeThumbnailTimer), 0.01 > this.fadeThumbnail.style.opacity && (this.container.removeChild(this.fadeThumbnail), delete this.fadeThumbnail, delete this.fadeThumbnailTimer));
        if (this.frameTimer && (this.frameCount++, 60 <= this.frameCount)) {
            var a = (new Date).getTime();
            if (void 0 !== this.frameTime) {
                var b = (a - this.frameTime) / this.frameCount,
                    b = Math.floor(100 *
                        b) / 100;
                this.frameTimer.innerHTML = b + " ms";
                this.frameTimer.style.color = 32 > b ? "green" : "red"
            }
            this.frameCount = 0;
            this.frameTime = a
        }
        this.guiScreen && this.guiScreen.playbackControls && (a = this.guiScreen.playbackControls.timelineSlider, a.draggingSlider ? this.viewer.scene.sceneAnimator.setAnimationProgress(a.sliderPercent, !0) : a.setSliderPercent(this.viewer.scene.sceneAnimator.animationProgress));
        if (this.sceneStats) {
            for (var c = b = a = 0; c < this.viewer.scene.meshes.length; ++c) var d = this.viewer.scene.meshes[c],
                a = a + d.indexCount /
                3,
                b = b + d.vertexCount;
            this.sceneStats.innerHTML = "Triangles: " + (a | 0).toLocaleString() + "<br>Vertices: " + (b | 0).toLocaleString();
            this.viewer.scene.sceneAnimator && this.viewer.scene.sceneAnimator.showPlayControls && (this.sceneStats.innerHTML += "<br><br><br><br>");
            a = !!this.sceneStats.parentElement;
            b = this.stripData.active() || !1;
            a && !b ? (this.container.removeChild(this.sceneStats), this.hostLogo && this.container.appendChild(this.hostLogo)) : !a && b && (this.container.appendChild(this.sceneStats), this.hostLogo && this.container.removeChild(this.hostLogo))
        }
        this.refreshUI();
        if (this.stripData.animationActive || this.stripData.active()) this.animateStrips(), this.stripData.animationActive && this.viewer.wake()
    };
    UI.prototype.animateStrips = function () {
        if (this.stripText)
            for (var a = Math.atan(this.viewer.canvas.height / this.viewer.canvas.width / this.stripData.stripSlant), b = 0; b < this.stripData.labels.length; ++b) {
                var c = this.stripData.strips[b],
                    c = c - this.stripData.stripSlant,
                    c = 0.5 + 0.5 * c;
                b == this.stripData.selectedStrip ? (this.stripText[b].style["-ms-transform"] = this.stripText[b].style["-webkit-transform"] = this.stripText[b].style.transform = "none", this.stripText[b].style.top = "4px", this.stripText[b].style.left = "0px", this.stripText[b].style.width =
                    "150px", this.stripText[b].txt.style.textAlign = "center", this.stripText[b].txt.style.background = "rgba(0, 0, 0, 0.75)", this.stripText[b].txt.style.background = "-webkit-linear-gradient(left, rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "-o-linear-gradient(left,      rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "-moz-linear-gradient(left,    rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "linear-gradient(left,         rgba(0,0,0,0.75), rgba(0,0,0,0))",
                    this.stripText[b].txt.style.paddingLeft = "32px", this.stripText[b].txt.style.paddingTop = "6px", this.stripText[b].txt.style.paddingBottom = "4px", this.stripText[b].txt.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)", this.stripText[b].line.style.opacity = 0.5, this.stripText[b].line.style.top = "100%", this.stripText[b].line.style.width = "100%", this.stripText[b].line.style.height = "1px") : (this.stripText[b].style["-ms-transform"] = this.stripText[b].style["-webkit-transform"] = this.stripText[b].style.transform = "translate(-50%, -50%) rotate(" +
                    a + "rad) translate(50%, 50%)", this.stripText[b].style.left = 100 * c + "%", this.stripText[b].style.top = "0px", this.stripText[b].style.width = "85px", this.stripText[b].txt.style.textAlign = "left", this.stripText[b].txt.style.background = "none", this.stripText[b].txt.style.paddingLeft = "8px", this.stripText[b].txt.style.paddingTop = "6px", this.stripText[b].txt.style.paddingBottom = "4px", this.stripText[b].txt.style.textShadow = "2px 0px 3px rgba(0,0,0,0.7)", this.stripText[b].line.style.opacity = 1, this.stripText[b].line.style.top =
                    "-1px", this.stripText[b].line.style.width = "10000px", this.stripText[b].line.style.height = "2px")
            }
    };
    var Vect = {
        type: Float32Array,
        create: function (a, b, c, d) {
            var e = new Vect.type(4);
            e[0] = a;
            e[1] = b;
            e[2] = c;
            e[3] = d;
            return e
        },
        empty: function () {
            return new Vect.type(4)
        },
        set: function (a, b, c, d, e) {
            a[0] = b;
            a[1] = c;
            a[2] = d;
            a[3] = e
        },
        copy: function (a, b) {
            a[0] = b[0];
            a[1] = b[1];
            a[2] = b[2];
            a[3] = b[3]
        },
        add: function (a, b, c) {
            a[0] = b[0] + c[0];
            a[1] = b[1] + c[1];
            a[2] = b[2] + c[2];
            a[3] = b[3] + c[3];
            return a
        },
        sub: function (a, b, c) {
            a[0] = b[0] - c[0];
            a[1] = b[1] - c[1];
            a[2] = b[2] - c[2];
            a[3] = b[3] - c[3];
            return a
        },
        scale: function (a, b, c) {
            a[0] = c[0] * b;
            a[1] = c[1] * b;
            a[2] = c[2] *
                b;
            a[3] = c[3] * b;
            return a
        },
        mul: function (a, b, c) {
            a[0] = b[0] * c[0];
            a[1] = b[1] * c[1];
            a[2] = b[2] * c[2];
            a[3] = b[3] * c[3];
            return a
        },
        mad: function (a, b, c, d) {
            a[0] = b[0] * c[0] + d[0];
            a[1] = b[1] * c[1] + d[1];
            a[2] = b[2] * c[2] + d[2];
            a[3] = b[3] * c[3] + d[3];
            return a
        },
        smad: function (a, b, c, d) {
            a[0] = b * c[0] + d[0];
            a[1] = b * c[1] + d[1];
            a[2] = b * c[2] + d[2];
            a[3] = b * c[3] + d[3];
            return a
        },
        negate: function (a, b) {
            a[0] = -b[0];
            a[1] = -b[1];
            a[2] = -b[2];
            return a
        },
        negate4: function (a, b) {
            a[0] = -b[0];
            a[1] = -b[1];
            a[2] = -b[2];
            a[3] = -b[3];
            return a
        },
        length: function (a) {
            var b = a[0],
                c = a[1];
            a = a[2];
            return Math.sqrt(b * b + c * c + a * a)
        },
        distance: function (a, b) {
            var c = a[0] - b[0],
                d = a[1] - b[1],
                e = a[2] - b[2];
            return Math.sqrt(c * c + d * d + e * e)
        },
        dot: function (a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        },
        dot4: function (a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
        },
        normalize: function (a, b) {
            var c = b[0],
                d = b[1],
                e = b[2],
                f = Math.sqrt(c * c + d * d + e * e);
            if (0 == f) return Vect.set(a, 0, 0, 0, 0);
            f = 1 / f;
            a[0] = c * f;
            a[1] = d * f;
            a[2] = e * f;
            return a
        },
        cross: function (a, b, c) {
            a[0] = b[1] * c[2];
            a[0] += -b[2] * c[1];
            a[1] = b[2] * c[0] - b[0] * c[2];
            a[2] = b[0] * c[1] -
                b[1] * c[0];
            return a
        },
        lerp: function (a, b, c, d) {
            var e = 1 - d;
            a[0] = b[0] * e + c[0] * d;
            a[1] = b[1] * e + c[1] * d;
            a[2] = b[2] * e + c[2] * d;
            return a
        },
        lerp4: function (a, b, c, d) {
            var e = 1 - d;
            a[0] = b[0] * e + c[0] * d;
            a[1] = b[1] * e + c[1] * d;
            a[2] = b[2] * e + c[2] * d;
            a[3] = b[3] * e + c[3] * d;
            return a
        },
        min: function (a, b, c) {
            a[0] = Math.min(b[0], c[0]);
            a[1] = Math.min(b[1], c[1]);
            a[2] = Math.min(b[2], c[2]);
            a[3] = Math.min(b[3], c[3]);
            return a
        },
        max: function (a, b, c) {
            a[0] = Math.max(b[0], c[0]);
            a[1] = Math.max(b[1], c[1]);
            a[2] = Math.max(b[2], c[2]);
            a[3] = Math.max(b[3], c[3]);
            return a
        },
        projectOnPlane: function (a,
            b, c, d) {
            var e = Vect.empty();
            Vect.sub(e, b, c);
            c = Vect.dot(e, d);
            smad(a, -c, normal, b);
            return a
        }
    };

    function View(a) {
        this.pivot = [0, 0, 0];
        this.rotation = [0, 0];
        this.radius = 1;
        this.nearPlane = 0.3;
        this.fov = 45;
        this.size = [1, 1];
        this.transform = Matrix.empty();
        this.viewMatrix = Matrix.empty();
        this.projectionMatrix = Matrix.empty();
        this.viewProjectionMatrix = Matrix.empty();
        a ? this.loadView(a, !0) : (this.saveResetView(), this.updateView(), this.updateProjection())
    }
    View.prototype.saveResetView = function () {
        this.resetDesc = {
            angles: [this.rotation[0], this.rotation[1]],
            pivot: [this.pivot[0], this.pivot[1], this.pivot[2]],
            limits: this.limits,
            orbitRadius: this.radius,
            fov: this.fov
        }
    };
    View.prototype.loadView = function (a, b) {
        a && (this.rotation[0] = a.angles[0], this.rotation[1] = a.angles[1], this.pivot[0] = a.pivot[0], this.pivot[1] = a.pivot[1], this.pivot[2] = a.pivot[2], this.radius = a.orbitRadius, this.fov = a.fov, this.limits = a.limits, b && this.saveResetView(), this.updateView(), this.updateProjection())
    };
    View.prototype.reset = function () {
        this.loadView(this.resetDesc)
    };
    View.prototype.updateView = function () {
        if (void 0 !== this.limits) {
            if (this.limits.angles) {
                var a = this.limits.angles.x,
                    b = this.limits.angles.y;
                if (void 0 !== a) {
                    var c = this.rotation[0] - a.offset,
                        a = Math.min(Math.max(c, a.min), a.max);
                    this.rotation[0] += a - c
                }
                void 0 !== b && (c = this.rotation[1] - b.offset, a = Math.min(Math.max(c, b.min), b.max), this.rotation[1] += a - c)
            }
            void 0 !== this.limits.orbitRadius && (b = this.limits.orbitRadius.min, c = this.limits.orbitRadius.max, void 0 !== b && (this.radius = Math.max(this.radius, b)), void 0 !== c && (this.radius =
                Math.min(this.radius, c)));
            void 0 !== this.limits.pan && (b = this.limits.pan, c = this.resetDesc.pivot, b.x && (this.pivot[0] = c[0]), b.y && (this.pivot[1] = c[1]), b.z && (this.pivot[2] = c[2]))
        }
        Matrix.translation(this.transform, 0, 0, this.radius);
        b = Matrix.rotation(Matrix.empty(), this.rotation[0], 0);
        c = Matrix.rotation(Matrix.empty(), this.rotation[1], 1);
        Matrix.mul(b, c, b);
        Matrix.mul(this.transform, b, this.transform);
        this.transform[12] += this.pivot[0];
        this.transform[13] += this.pivot[1];
        this.transform[14] += this.pivot[2];
        Matrix.invert(this.viewMatrix,
            this.transform);
        Matrix.mul(this.viewProjectionMatrix, this.viewMatrix, this.projectionMatrix)
    };
    View.prototype.updateProjection = function (a) {
        Matrix.perspectiveInfinite(this.projectionMatrix, this.fov, this.size[0] / this.size[1], this.nearPlane, a);
        Matrix.mul(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix)
    };

    function WebViewer(a, b, c, d) {
        this.mobile = !!/Android|iPhone|iPod|iPad|Windows Phone|IEMobile|BlackBerry|webOS/.test(navigator.userAgent);
        this.mobileFast = !!/iPhone|iPad/.test(navigator.userAgent);
        var e;
        if (e = !this.mobile) a: {
            e = document.createElement("canvas");e.width = e.height = 16;
            if (e = e.getContext("webgl", {}) || e.getContext("experimental-webgl", {})) {
                var f = e.getExtension("WEBGL_debug_renderer_info");
                if (f) {
                    e = e.getParameter(f.UNMASKED_RENDERER_WEBGL);
                    e = !!/Intel|INTEL/.test(e);
                    break a
                }
            }
            e = !1
        }
        this.desktopSlow =
            e;
        this.domRoot = document.createElement("div");
        this.domRoot.style.width = a + "px";
        this.domRoot.style.height = b + "px";
        this.initCanvas(a, b);
        this.scene = this.input = null;
        this.sceneURL = c;
        this.sleepCounter = 8;
        this.onLoad = null;
        this.stripData = new StripData;
        this.ui = new UI(this);
        this.ui.setSize(a, b);
        this.ui.showPreview(d)
    }
    WebViewer.prototype.initCanvas = function (a, b) {
        this.canvas && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = document.createElement("canvas");
        this.pixelRatio = window.devicePixelRatio || 1;
        if (this.mobile) {
            var c = this.mobileFast ? 1.5 : 1;
            this.pixelRatio = this.pixelRatio > c ? c : this.pixelRatio
        } else this.desktopSlow && (this.pixelRatio = 1);
        this.canvas.width = a * this.pixelRatio;
        this.canvas.height = b * this.pixelRatio;
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        this.canvas.style.position =
            "absolute";
        this.domRoot.appendChild(this.canvas)
    };
    WebViewer.prototype.initGL = function () {
        var a = {
                alpha: !!marmoset.transparentBackground,
                depth: !1,
                stencil: !1,
                antialias: !1,
                premultipliedAlpha: !!marmoset.transparentBackground,
                preserveDrawingBuffer: !1
            },
            a = this.gl = this.canvas.getContext("webgl", a) || this.canvas.getContext("experimental-webgl", a);
        if (!this.gl) return this.ui.showFailure('Please <a href="http://get.webgl.org/" target=_blank>check<a/> to ensure your browser has support for WebGL.'), !1;
        this.canvas.addEventListener("webglcontextlost", function (a) {
                a.preventDefault()
            }.bind(this),
            !1);
        this.canvas.addEventListener("webglcontextrestored", function (a) {
            this.loadScene(this.sceneURL)
        }.bind(this), !1);
        a.ext = {
            textureAniso: a.getExtension("EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || a.getExtension("MOZ_EXT_texture_filter_anisotropic"),
            textureFloat: a.getExtension("OES_texture_float"),
            textureFloatLinear: a.getExtension("OES_texture_float_linear"),
            textureHalf: a.getExtension("OES_texture_half_float"),
            textureHalfLinear: a.getExtension("OES_texture_half_float_linear"),
            textureDepth: a.getExtension("WEBGL_depth_texture"),
            colorBufferFloat: a.getExtension("WEBGL_color_buffer_float"),
            colorBufferHalf: a.getExtension("EXT_color_buffer_half_float"),
            index32bit: a.getExtension("OES_element_index_uint"),
            loseContext: a.getExtension("WEBGL_lose_context"),
            derivatives: a.getExtension("OES_standard_derivatives"),
            renderInfo: a.getExtension("WEBGL_debug_renderer_info")
        };
        a.limits = {
            textureSize: a.getParameter(a.MAX_TEXTURE_SIZE),
            textureCount: a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),
            varyings: a.getParameter(a.MAX_VARYING_VECTORS),
            vertexAttribs: a.getParameter(a.MAX_VERTEX_ATTRIBS),
            vertexUniforms: a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),
            fragmentUniforms: a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),
            viewportSizes: a.getParameter(a.MAX_VIEWPORT_DIMS),
            vendor: a.getParameter(a.VENDOR),
            version: a.getParameter(a.VERSION)
        };
        a.hints = {
            mobile: this.mobile,
            pixelRatio: this.pixelRatio
        };
        a.enable(a.DEPTH_TEST);
        a.shaderCache = new ShaderCache(a);
        a.textureCache = new TextureCache(a);
        this.allocBacking();
        return !0
    };
    WebViewer.prototype.allocBacking = function () {
        var a = this.gl,
            b = !1,
            c = {
                width: this.canvas.width,
                height: this.canvas.height
            };
        this.mainColor = new Texture(a, c);
        this.mainDepth = null;
        a.ext.textureDepth && (this.mainDepth = new Texture(a, {
            width: this.canvas.width,
            height: this.canvas.height,
            nofilter: !0
        }), this.mainDepth.loadArray(null, a.DEPTH_COMPONENT, a.UNSIGNED_INT));
        a.ext.textureHalf && a.ext.textureHalfLinear && (this.mainColor.loadArray(null, a.RGBA, a.ext.textureHalf.HALF_FLOAT_OES), this.mainBuffer = new Framebuffer(a, {
            color0: this.mainColor,
            depth: this.mainDepth,
            createDepth: !this.mainDepth
        }), b = this.mainBuffer.valid);
        !b && a.ext.textureFloat && a.ext.textureFloatLinear && !a.hints.mobile && (this.mainColor.loadArray(null, a.RGBA, a.FLOAT), this.mainBuffer = new Framebuffer(a, {
            color0: this.mainColor,
            depth: this.mainDepth,
            createDepth: !this.mainDepth
        }), b = this.mainBuffer.valid);
        for (; !b;) this.mainColor = new Texture(a, c), this.mainColor.loadArray(null, a.RGBA, a.UNSIGNED_BYTE), this.mainBuffer = new Framebuffer(a, {
                color0: this.mainColor,
                depth: this.mainDepth,
                createDepth: !this.mainDepth
            }),
            b = this.mainBuffer.valid, c.width /= 2, c.height /= 2, this.mainDepth && (this.mainDepth.destroy(), this.mainDepth = null);
        this.mainBufferNoDepth = new Framebuffer(a, {
            color0: this.mainColor
        })
    };
    WebViewer.prototype.loadScene = function (a) {
        this.sceneURL = a || this.sceneURL;
        this.scene = this.input = null;
        if (this.initGL() && this.sceneURL) {
            var b = this.ui.signalLoadProgress.bind(this.ui);
            a = function (a) {
                b(1, 1);
                this.scene = new Scene(this.gl);
                this.scene.stripData = this.stripData;
                if (this.scene.load(new Archive(a)))
                    if (2070 >= this.scene.metaData.tbVersion) this.ui.showFailure("This .mview file is from an out-of-date beta version of Toolbag. Please re-export it with the new version. Thanks!");
                    else {
                        if (this.bindInput(),
                            this.requestFrame(this.updateLoad.bind(this)), this.onLoad) this.onLoad()
                    }
                else this.ui.showFailure("Package file could not be read or is invalid.")
            }.bind(this);
            var c = function () {
                this.ui.showFailure("Package file (" + this.sceneURL + ") could not be retrieved.")
            }.bind(this);
            Network.fetchBinary(this.sceneURL, a, c, b)
        }
    };
    WebViewer.prototype.unload = function () {
        delete this.scene;
        delete this.input;
        delete this.ui;
        delete this.mainColor;
        delete this.mainBuffer;
        delete this.gl;
        var a = this.domRoot.clientWidth,
            b = this.domRoot.clientHeight;
        this.initCanvas(a, b);
        this.ui = new UI(this);
        this.ui.setSize(a, b);
        this.ui.showPreview();
        this.cancelFrame()
    };
    WebViewer.prototype.bindInput = function () {
        this.input = new Input(this.ui.container);
        this.input.onDrag.push(function (a, b, c, d) {
            a = 1 - 2.2 / (Math.sqrt(c * c + d * d) + 2.2);
            b = this.scene.view;
            b.rotation[1] -= 0.4 * c * a;
            b.rotation[0] -= 0.4 * d * a;
            b.rotation[0] = 90 < b.rotation[0] ? 90 : b.rotation[0];
            b.rotation[0] = -90 > b.rotation[0] ? -90 : b.rotation[0];
            b.updateView();
            this.wake()
        }.bind(this));
        this.input.onPan.push(function (a, b) {
            var c = this.scene.view,
                d = c.fov / 45 * 0.8 * (c.radius / this.domRoot.clientHeight),
                e = -a * d,
                d = b * d;
            c.pivot[0] += e * c.transform[0] +
                d * c.transform[4];
            c.pivot[1] += e * c.transform[1] + d * c.transform[5];
            c.pivot[2] += e * c.transform[2] + d * c.transform[6];
            c.updateView();
            this.wake()
        }.bind(this));
        this.input.onPan2.push(function (a, b) {
            var c = 1 - 2.2 / (Math.sqrt(a * a + b * b) + 2.2);
            this.scene.lights.rotation -= 0.4 * a * c;
            this.wake()
        }.bind(this));
        this.input.onZoom.push(function (a) {
            var b = this.scene.view;
            b.radius *= 1 - 0.002 * a;
            b.radius = 0.001 > b.radius ? 0.001 : b.radius;
            b.radius = 1E3 < b.radius ? 1E3 : b.radius;
            b.updateView();
            this.wake()
        }.bind(this));
        this.input.onDoubleTap.push(function (a,
            b) {
            this.scene.view.reset();
            this.scene.sceneAnimator && this.scene.sceneAnimator.resetCustomView();
            this.wake()
        }.bind(this));
        this.ui.bindInput(this.input)
    };
    WebViewer.prototype.wake = function (a) {
        a = a || 16;
        this.sleepCounter = this.sleepCounter < a ? a : this.sleepCounter;
        this.scene.postRender.discardAAHistory();
        this.requestFrame(this.update.bind(this))
    };
    WebViewer.prototype.requestFrame = function (a) {
        var b = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        if (!this.frameRequestPending) {
            var c = function () {
                this.frameRequestPending = 0;
                a()
            }.bind(this);
            this.frameRequestPending = b(c, this.canvas)
        }
    };
    WebViewer.prototype.cancelFrame = function () {
        this.frameRequestPending && (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame)(this.frameRequestPending)
    };
    WebViewer.prototype.fullscreenChange = function () {
        FullScreen.active() ? (this.oldRootWidth = this.domRoot.style.width, this.oldRootHeight = this.domRoot.style.height, this.domRoot.style.width = "100%", this.domRoot.style.height = "100%") : (this.domRoot.style.width = this.oldRootWidth, this.domRoot.style.height = this.oldRootHeight);
        this.wake()
    };
    WebViewer.prototype.resize = function (a, b) {
        a && b ? (this.domRoot.style.width = a + "px", this.domRoot.style.height = b + "px") : (a = this.domRoot.clientWidth, b = this.domRoot.clientHeight);
        this.canvas.width = a * this.pixelRatio;
        this.canvas.height = b * this.pixelRatio;
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        this.ui.setSize(a, b);
        this.allocBacking();
        this.wake()
    };
    WebViewer.prototype.updateLoad = function () {
        this.scene.complete() ? this.start() : this.requestFrame(this.updateLoad.bind(this));
        this.ui.animate()
    };
    WebViewer.prototype.start = function () {
        this.scene.view.updateView();
        this.ui.showActiveView();
        this.requestFrame(this.update.bind(this))
    };
    WebViewer.prototype.update = function () {
        var a = this.scene.sceneAnimator && !this.scene.sceneAnimator.paused;
        if (0 < this.sleepCounter || this.ui.animating() || a || this.stripData.animationActive) this.stripData.update(), this.ui.animate(), this.scene.update(), this.drawScene(), this.requestFrame(this.update.bind(this));
        a ? this.scene.postRender.discardAAHistory() : this.sleepCounter--
    };
    WebViewer.prototype.reDrawScene = function () {
        this.stripData.update();
        this.ui.animate();
        this.scene.update();
        this.drawScene();
        this.requestFrame(this.update.bind(this));
        this.scene.postRender.discardAAHistory()
    };
    WebViewer.prototype.drawScene = function () {
        this.gl.isContextLost() || (this.domRoot.clientWidth == this.canvas.clientWidth && this.domRoot.clientHeight == this.canvas.clientHeight || this.resize(), this.scene.view.size = [this.mainBuffer.width, this.mainBuffer.height], this.scene.view.updateProjection(), this.scene.postRender.adjustProjectionForSupersampling(this.scene.view), this.scene.collectShadows(this.mainBuffer), this.mainBuffer.bind(), this.scene.draw(this.mainBuffer), this.mainDepth && (this.mainBufferNoDepth.bind(),
            this.scene.drawSecondary(this.mainDepth)), this.scene.postRender.present(this.mainColor, this.canvas.width, this.canvas.height, this.stripData.active()))
    };
    marmoset = "undefined" == typeof marmoset ? {} : marmoset;
    marmoset.WebViewer = WebViewer;
    marmoset.dataLocale = (0 == window.location.protocol.indexOf("https") ? "https:" : "http:") + "//viewer.marmoset.co/main/data/";
    var ShaderTable = {
        "alphaprepassfrag.glsl": "precision mediump float;\n#include <matdither.glsl>\nuniform sampler2D tAlbedo;varying mediump vec2 d;void main(){float e=texture2D(tAlbedo,d).a;if(e<=f(d.x)){discard;}gl_FragColor=vec4(0.0);}",
        "alphaprepassvert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;uniform vec2 uUVOffset;attribute vec3 vPosition;attribute vec2 vTexCoord;varying mediump vec2 d;vec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}void main(void){gl_Position=h(uModelViewProjectionMatrix,vPosition.xyz);d=vTexCoord+uUVOffset;}",
        "bloom.glsl": "precision mediump float;uniform sampler2D tInput;uniform vec4 uKernel[BLOOM_SAMPLES];varying highp vec2 j;void main(void){vec3 c=vec3(0.0,0.0,0.0);for(int k=0;k<BLOOM_SAMPLES;++k){vec3 l=uKernel[k].xyz;vec3 m=texture2D(tInput,j+l.xy).xyz;m=max(m,vec3(0.0,0.0,0.0));c+=m*l.z;}gl_FragColor.xyz=c;gl_FragColor.w=0.0;}",
        "bloomshrink.glsl": "precision highp float;uniform sampler2D tInput;varying highp vec2 j;void main(void){float o=0.25/256.0;gl_FragColor=0.25*(texture2D(tInput,j+vec2(o,o))+texture2D(tInput,j+vec2(o,-o))+texture2D(tInput,j+vec2(-o,o))+texture2D(tInput,j+vec2(-o,-o)));}",
        "fogfrag.glsl": "precision highp float;uniform sampler2D tDepth;uniform vec3 uDepthToZ;uniform vec4 uUnproject;uniform mat4 uInvViewMatrix;uniform float uFogInvDistance;uniform float uFogOpacity;uniform float uFogDispersion;uniform vec3 uFogType;uniform vec3 uFogColor;uniform float uFogIllum;uniform mat4 uLightMatrix;\n#ifdef FOG_IBL\nuniform vec4 uFogLightSphere[9];\n#else\nuniform vec4 uSpotParams;uniform vec4 uLightPosition;uniform vec3 uLightColor;uniform vec4 uLightAttenuation;\n#ifdef FOG_SHADOWS\nuniform mat4 uShadowProj;uniform sampler2D uShadowMap;uniform float uDitherOffset;uniform vec4 uCylinder;\n#endif\n#endif\nvec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}vec3 u(mat4 i,vec3 v){return i[0].xyz*v.x+i[1].xyz*v.y+i[2].xyz*v.z;}float A(float B){B*=uFogInvDistance;float C=uFogType.x*min(B,1.0)+(uFogType.y-uFogType.y/(1.0+16.0*B*B))+(uFogType.z-uFogType.z*exp(-3.0*B));return C*uFogOpacity;}\n#ifdef FOG_SHADOWS\nfloat D(vec3 E){vec4 p=h(uShadowProj,E);vec3 F=p.xyz/p.w;vec4 G=texture2D(uShadowMap,F.xy);float H=(G.x+G.y*(1.0/255.0))+G.z*(1.0/65025.0);return F.z<H || H>=1.0?1.0:0.0;}float f(vec2 I){return fract(sin(dot(I,vec2(12.9898,78.233)))*43758.5453+uDitherOffset);}void J(vec3 K,vec3 L,out float M,out float N){vec3 v=uSpotParams.xyz,p=uCylinder.xyz;vec3 O=L-dot(L,v)*v;vec3 P=(K-p)-dot(K-p,v)*v;float a=dot(O,O);float b=2.0*dot(O,P);float c=dot(P,P)-uCylinder.w;float Q=b*b-4.0*a*c;if(Q>=0.0){Q=sqrt(Q);M=(-b-Q)/(2.0*a);N=(-b+Q)/(2.0*a);}else {M=N=0.0;}}\n#endif\nvarying vec2 j;void main(void){vec3 R=uInvViewMatrix[3].xyz;float H=texture2D(tDepth,j).x;H=min(H,0.9999);vec3 S;S.z=uDepthToZ.y/(uDepthToZ.z*H+uDepthToZ.x);S.xy=S.z*(j*uUnproject.xy+uUnproject.zw);S=h(uInvViewMatrix,S).xyz;vec3 T;T.xy=(j*uUnproject.xy+uUnproject.zw);T.z=1.0;T=normalize(u(uInvViewMatrix,-T).xyz);vec3 U=uFogColor;\n#if defined(FOG_IBL)\nvec3 G=u(uLightMatrix,T);vec3 V=uFogLightSphere[0].xyz;V+=uFogLightSphere[1].xyz*G.y;V+=uFogLightSphere[2].xyz*G.z;V+=uFogLightSphere[3].xyz*G.x;vec3 swz=G.yyz*G.xzx;V+=uFogLightSphere[4].xyz*swz.x;V+=uFogLightSphere[5].xyz*swz.y;V+=uFogLightSphere[7].xyz*swz.z;vec3 sqr=G*G;V+=uFogLightSphere[6].xyz*(3.0*sqr.z-1.0);V+=uFogLightSphere[8].xyz*(sqr.x-sqr.y);U=mix(U,U*V,uFogIllum);float C=A(length(S-R));gl_FragColor.xyz=U*C;gl_FragColor.w=C;return;\n#else\n#if defined(FOG_SPOT) || defined(FOG_OMNI)\nfloat W=0.0,X=0.0;{float r=1.0/(uLightAttenuation.z);float a=1.0;float b=2.0*dot(T,R-uLightPosition.xyz);float c=dot(uLightPosition.xyz,uLightPosition.xyz)+dot(R,R)+-2.0*dot(uLightPosition.xyz,R)+-r*r;float Q=b*b-4.0*a*c;if(Q>=0.0){Q=sqrt(Q);W=(-b-Q)/(2.0*a);X=(-b+Q)/(2.0*a);}}\n#if defined(FOG_SPOT)\n{float Y=uSpotParams.w,Z=1.0-Y;vec3 v=T;vec3 dc=uSpotParams.xyz;vec3 dd=R-uLightPosition.xyz;vec3 de=v-dot(v,dc)*dc,df=dd-dot(dd,dc)*dc;float a=Y*dot(de,de)-Z*dot(v,dc)*dot(v,dc);float b=2.0*Y*dot(de,df)-2.0*Z*dot(v,dc)*dot(dd,dc);float c=Y*dot(df,df)-Z*dot(dd,dc)*dot(dd,dc);float Q=b*b-4.0*a*c;if(Q>=0.0){float dh=(-b-sqrt(Q))/(2.0*a);float di=(-b+sqrt(Q))/(2.0*a);if(di<dh){float de=dh;dh=di;di=de;}bool dj=dot(-uLightPosition.xyz+R+T*dh,uSpotParams.xyz)<=0.0;bool dk=dot(-uLightPosition.xyz+R+T*di,uSpotParams.xyz)<=0.0;if(!dj ||!dk){if(dj){dh=di;di=X;}else if(dk){di=dh;dh=W;}W=max(W,dh);X=min(X,di);}else {X=W=0.0;}}else {X=W=0.0;}}\n#endif\nfloat tx=dot(T,S-R);W=clamp(W,0.0,tx);X=clamp(X,0.0,tx);float dl=0.0;if(X>W){\n#ifdef FOG_SHADOWS\n#ifdef MOBILE\n#define SAMPLES 16\n#else\n#define SAMPLES 32\n#endif\nfloat dm=f(j)*(X-W)/float(SAMPLES-2);\n#else\n#define SAMPLES 8\nfloat dm=0.0;\n#endif\nfor(int k=0;k<SAMPLES;++k){float t=W+(X-W)*float(k)/float(SAMPLES-1);vec3 p=R+(t+dm)*T;float a=clamp(length(p-uLightPosition.xyz)*uLightAttenuation.z,0.0,1.0);a=1.0+uLightAttenuation.x*a+uLightAttenuation.y*a*a;\n#ifdef FOG_SHADOWS\na*=D(p);\n#endif\ndl+=a-a*A(t);}dl*=1.0/float(SAMPLES);dl*=(X-W)*uLightAttenuation.z;dl*=A(X-W);}U*=dl*uFogIllum;\n#elif defined(FOG_DIR)\nfloat C=A(dot(T,S-R));\n#ifdef FOG_SHADOWS\nfloat W,X;J(R,T,W,X);float tx=dot(T,S-R);W=clamp(W,0.0,tx);X=clamp(X,0.0,tx);if(X>W){\n#ifdef MOBILE\n#define SAMPLES 16\n#else\n#define SAMPLES 32\n#endif\nfloat dl=0.0;float dm=f(j)*(X-W)/float(SAMPLES-2);float dn=(X-W)*(1.0/float(SAMPLES));for(int k=0;k<SAMPLES;++k){float t=W+float(k)*dn+dm;vec3 p=R+t*T;float s=D(p);C-=(1.0-s)*(A(t+dn)-A(t));}}\n#endif\nfloat du=0.5+0.5*dot(T,-uSpotParams.xyz);du=1.0+uFogDispersion*(2.0*du*du-1.0);U*=(0.1*C)*(du*uFogIllum);\n#endif\ngl_FragColor.xyz=U*uLightColor;gl_FragColor.w=0.0;\n#endif\n}",
        "fogvert.glsl": "precision highp float;attribute vec2 vCoord;varying vec2 j;void main(void){j=vCoord;gl_Position.xy=2.0*vCoord-vec2(1.0,1.0);gl_Position.zw=vec2(0.0,1.0);}",
        "matdither.glsl": "float f(highp float I){highp float G=0.5*fract(gl_FragCoord.x*0.5)+0.5*fract(gl_FragCoord.y*0.5);return 0.4+0.6*fract(G+3.141592e6*I);}",
        "matfrag.glsl": "\n#extension GL_OES_standard_derivatives : enable\nprecision mediump float;varying highp vec3 dv;varying mediump vec2 d;varying mediump vec3 dA;varying mediump vec3 dB;varying mediump vec3 dC;\n#ifdef VERTEX_COLOR\nvarying lowp vec4 dD;\n#endif\n#ifdef TEXCOORD_SECONDARY\nvarying mediump vec2 dE;\n#endif\nuniform sampler2D tAlbedo;uniform sampler2D tReflectivity;uniform sampler2D tNormal;uniform sampler2D tExtras;uniform sampler2D tSkySpecular;\n#ifdef REFRACTION\nuniform sampler2D tRefraction;\n#endif\nuniform vec4 uDiffuseCoefficients[9];uniform vec3 uCameraPosition;uniform float uAlphaTest;uniform vec3 uFresnel;uniform float uHorizonOcclude;uniform float uHorizonSmoothing;\n#ifdef EMISSIVE\nuniform float uEmissiveScale;uniform vec4 uTexRangeEmissive;\n#endif\n#ifdef AMBIENT_OCCLUSION\nuniform vec4 uTexRangeAO;\n#endif\n#ifdef REFRACTION\nuniform float uRefractionIOREntry;uniform float uRefractionRayDistance;uniform vec3 uRefractionTint;uniform float uRefractionAlbedoTint;uniform mat4 uRefractionViewProjection;uniform vec4 uTexRangeRefraction;\n#endif\n#ifdef LIGHT_COUNT\nuniform vec4 uLightPositions[LIGHT_COUNT];uniform vec3 uLightDirections[LIGHT_COUNT];uniform vec3 uLightColors[LIGHT_COUNT];uniform vec3 uLightParams[LIGHT_COUNT];uniform vec3 uLightSpot[LIGHT_COUNT];\n#endif\n#ifdef ANISO\nuniform float uAnisoStrength;uniform vec3 uAnisoTangent;uniform float uAnisoIntegral;uniform vec4 uTexRangeAniso;\n#endif\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#include <matsampling.glsl>\n#include <matlighting.glsl>\n#include <matshadows.glsl>\n#include <matskin.glsl>\n#include <matmicrofiber.glsl>\n#include <matstrips.glsl>\n#ifdef TRANSPARENCY_DITHER\n#include <matdither.glsl>\n#endif\nvoid main(void){vec4 m=texture2D(tAlbedo,d);vec3 dF=dG(m.xyz);float e=m.w;\n#ifdef VERTEX_COLOR\n{vec3 dH=dD.xyz;\n#ifdef VERTEX_COLOR_SRGB\ndH=dH*(dH*(dH*0.305306011+vec3(0.682171111))+vec3(0.012522878));\n#endif\ndF*=dH;\n#ifdef VERTEX_COLOR_ALPHA\ne*=dD.w;\n#endif\n}\n#endif\n#ifdef ALPHA_TEST\nif(e<uAlphaTest){discard;}\n#endif\n#ifdef TRANSPARENCY_DITHER\ne=(e>f(d.x))?1.0:e;\n#endif\nvec3 dI=dJ(texture2D(tNormal,d).xyz);\n#ifdef ANISO\n#ifdef ANISO_NO_DIR_TEX\nvec3 dK=dL(uAnisoTangent);\n#else\nm=dM(d,uTexRangeAniso);vec3 dK=2.0*m.xyz-vec3(1.0);dK=dL(dK);\n#endif\ndK=dK-dI*dot(dK,dI);dK=normalize(dK);vec3 dN=dK*uAnisoStrength;\n#endif\nvec3 dO=normalize(uCameraPosition-dv);m=texture2D(tReflectivity,d);vec3 dP=dG(m.xyz);float dQ=m.w;float dR=dQ;\n#ifdef HORIZON_SMOOTHING\nfloat dS=dot(dO,dI);dS=uHorizonSmoothing-dS*uHorizonSmoothing;dQ=mix(dQ,1.0,dS*dS);\n#endif\n#ifdef STRIPVIEW\ndT dU;dV(dU,dQ,dP);\n#endif\nfloat dW=1.0;\n#ifdef AMBIENT_OCCLUSION\n#ifdef AMBIENT_OCCLUSION_SECONDARY_UV\ndW=dM(dE,uTexRangeAO).x;\n#else\ndW=dM(d,uTexRangeAO).x;\n#endif\ndW*=dW;\n#endif\n#if defined(SKIN)\ndX dY;dZ(dY);dY.ec*=dW;\n#elif defined(MICROFIBER)\ned ee;ef(ee,dI);ee.eh*=dW;\n#else\nvec3 ei=ej(dI);ei*=dW;\n#endif\nvec3 ek=reflect(-dO,dI);\n#ifdef ANISO\nvec3 rt=ek-(0.5*dN*dot(ek,dK));vec3 el=em(rt,mix(dQ,0.5*dQ,uAnisoStrength));\n#else\nvec3 el=em(ek,dQ);\n#endif\nel*=en(ek,dC);\n#ifdef LIGHT_COUNT\nhighp float eo=10.0/log2(dQ*0.968+0.03);eo*=eo;float eu=eo*(1.0/(8.0*3.1415926))+(4.0/(8.0*3.1415926));eu=min(eu,1.0e3);\n#ifdef SHADOW_COUNT\nev eA;\n#ifdef SKIN\n#ifdef SKIN_VERSION_1\neB(eA,SHADOW_KERNEL+SHADOW_KERNEL*dY.eC);\n#else\neD eE;float eF=SHADOW_KERNEL+SHADOW_KERNEL*dY.eC;eG(eE,eF);eB(eA,eF);\n#endif\n#else\neB(eA,SHADOW_KERNEL);\n#endif\n#endif\n#ifdef ANISO\neu*=uAnisoIntegral;\n#endif\nfor(int k=0;k<LIGHT_COUNT;++k){vec3 eH=uLightPositions[k].xyz-dv*uLightPositions[k].w;float eI=inversesqrt(dot(eH,eH));eH*=eI;float a=saturate(uLightParams[k].z/eI);a=1.0+a*(uLightParams[k].x+uLightParams[k].y*a);float s=saturate(dot(eH,uLightDirections[k]));s=saturate(uLightSpot[k].y-uLightSpot[k].z*(1.0-s*s));vec3 eJ=(a*s)*uLightColors[k].xyz;\n#if defined(SKIN)\n#ifdef SHADOW_COUNT\n#ifdef SKIN_VERSION_1\neK(dY,eA.eL[k],1.0,eH,dI,eJ);\n#else\neK(dY,eA.eL[k],eE.eE[k],eH,dI,eJ);\n#endif\n#else\neK(dY,1.0,0.0,eH,dI,eJ);\n#endif\n#elif defined(MICROFIBER)\n#ifdef SHADOW_COUNT\neM(ee,eA.eL[k],eH,dI,eJ);\n#else\neM(ee,1.0,eH,dI,eJ);\n#endif\n#else\nfloat eN=saturate((1.0/3.1415926)*dot(eH,dI));\n#ifdef SHADOW_COUNT\neN*=eA.eL[k];\n#endif\nei+=eN*eJ;\n#endif\nvec3 eO=eH+dO;\n#ifdef ANISO\neO=eO-(dN*dot(eO,dK));\n#endif\neO=normalize(eO);float eP=eu*pow(saturate(dot(eO,dI)),eo);\n#ifdef SHADOW_COUNT\neP*=eA.eL[k];\n#endif\nel+=eP*eJ;}\n#endif\n#if defined(SKIN)\nvec3 ei,diff_extra;eQ(ei,diff_extra,dY,dO,dI,dQ);\n#elif defined(MICROFIBER)\nvec3 ei,diff_extra;eR(ei,diff_extra,ee,dO,dI,dQ);\n#endif\nvec3 eS=eT(dO,dI,dP,dQ*dQ);el*=eS;\n#ifdef REFRACTION\nvec4 eU;{vec3 G=refract(-dO,dI,uRefractionIOREntry);G=dv+G*uRefractionRayDistance;vec4 eV=uRefractionViewProjection[0]*G.x+(uRefractionViewProjection[1]*G.y+(uRefractionViewProjection[2]*G.z+uRefractionViewProjection[3]));vec2 c=eV.xy/eV.w;c=0.5*c+vec2(0.5,0.5);vec2 i=mod(floor(c),2.0);c=fract(c);c.x=i.x>0.0?1.0-c.x:c.x;c.y=i.y>0.0?1.0-c.y:c.y;eU.rgb=texture2D(tRefraction,c).xyz;eU.rgb=mix(eU.rgb,eU.rgb*dF,uRefractionAlbedoTint);eU.rgb=eU.rgb-eU.rgb*eS;eU.rgb*=uRefractionTint;\n#ifdef REFRACTION_NO_MASK_TEX\neU.a=1.0;\n#else\neU.a=dM(d,uTexRangeRefraction).x;\n#endif\n}\n#endif\n#ifdef DIFFUSE_UNLIT\ngl_FragColor.xyz=dF;\n#else\ngl_FragColor.xyz=ei*dF;\n#endif\n#ifdef REFRACTION\ngl_FragColor.xyz=mix(gl_FragColor.xyz,eU.rgb,eU.a);\n#endif\ngl_FragColor.xyz+=el;\n#if defined(SKIN) || defined(MICROFIBER)\ngl_FragColor.xyz+=diff_extra;\n#endif\n#ifdef EMISSIVE\n#ifdef EMISSIVE_SECONDARY_UV\nvec2 eW=dE;\n#else\nvec2 eW=d;\n#endif\ngl_FragColor.xyz+=uEmissiveScale*dG(dM(eW,uTexRangeEmissive).xyz);\n#endif\n#ifdef STRIPVIEW\ngl_FragColor.xyz=eX(dU,dI,dF,dP,dR,ei,el,gl_FragColor.xyz);\n#endif\n#ifdef NOBLEND\ngl_FragColor.w=1.0;\n#else\ngl_FragColor.w=e;\n#endif\n}",
        "matlighting.glsl": "vec3 eY(vec3 eZ,float fc){return exp(-0.5*fc/(eZ*eZ))/(eZ*2.5066283);}vec3 fd(vec3 eZ){return vec3(1.0,1.0,1.0)/(eZ*2.5066283);}vec3 fe(vec3 ff){return vec3(-0.5,-0.5,-0.5)/(ff);}vec3 fh(vec3 fi,float fc){return exp(fi*fc);}\n#define SAMPLE_COUNT 21.0\n#define SAMPLE_HALF 10.0\n#define GAUSS_SPREAD 0.05\nvec3 fj(float fk,float fl,vec3 fm){vec3 fn=vec3(fl,fl,fl);fn=0.8*fn+vec3(0.2);vec3 fo=cos(fn*3.14159);vec3 fu=cos(fn*3.14159*0.5);fu*=fu;fu*=fu;fu*=fu;fn=fn+0.05*fo*fu*fm;fu*=fu;fu*=fu;fu*=fu;fn=fn+0.1*fo*fu*fm;fn=saturate(fn);fn*=fn*1.2;return fn;}vec3 fv(vec3 fm){return vec3(1.0,1.0,1.0)/3.1415926;}float fA(float fk,float fm){return saturate(-fk*fm+fk+fm);}vec3 fB(float fk,vec3 fm){return saturate(-fk*fm+vec3(fk)+fm);}float fC(float fm){return-0.31830988618379*fm+0.31830988618379;}vec3 fD(vec3 fm){return-0.31830988618379*fm+vec3(0.31830988618379);}vec3 eT(vec3 dO,vec3 dI,vec3 dP,float fE){float C=1.0-saturate(dot(dO,dI));float fF=C*C;C*=fF*fF;C*=fE;return(dP-C*dP)+C*uFresnel;}vec2 fG(vec2 fH,vec2 fm){fH=1.0-fH;vec2 fI=fH*fH;fI*=fI;fH=mix(fI,fH*0.4,fm);return fH;}vec3 ej(vec3 fJ){\n#define c(n) uDiffuseCoefficients[n].xyz\nvec3 G=(c(0)+fJ.y*((c(1)+c(4)*fJ.x)+c(5)*fJ.z))+fJ.x*(c(3)+c(7)*fJ.z)+c(2)*fJ.z;\n#undef c\nvec3 sqr=fJ*fJ;G+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);G+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);return G;}void fK(inout vec3 fL,inout vec3 fM,inout vec3 fN,vec3 fJ){fL=uDiffuseCoefficients[0].xyz;fM=uDiffuseCoefficients[1].xyz*fJ.y;fM+=uDiffuseCoefficients[2].xyz*fJ.z;fM+=uDiffuseCoefficients[3].xyz*fJ.x;vec3 swz=fJ.yyz*fJ.xzx;fN=uDiffuseCoefficients[4].xyz*swz.x;fN+=uDiffuseCoefficients[5].xyz*swz.y;fN+=uDiffuseCoefficients[7].xyz*swz.z;vec3 sqr=fJ*fJ;fN+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);fN+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);}vec3 fO(vec3 fL,vec3 fM,vec3 fN,vec3 fP,float fm){fP=mix(vec3(1.0),fP,fm);return(fL+fM*fP.x)+fN*fP.z;}vec3 fQ(vec3 fL,vec3 fM,vec3 fN,vec3 fP,vec3 fR){vec3 fS=mix(vec3(1.0),fP.yyy,fR);vec3 fT=mix(vec3(1.0),fP.zzz,fR);return(fL+fM*fS)+fN*fT;}vec3 em(vec3 fJ,float dQ){fJ/=dot(vec3(1.0),abs(fJ));vec2 fU=abs(fJ.zx)-vec2(1.0,1.0);vec2 fV=vec2(fJ.x<0.0?fU.x:-fU.x,fJ.z<0.0?fU.y:-fU.y);vec2 fW=(fJ.y<0.0)?fV:fJ.xz;fW=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fW+vec2(0.5,0.125*0.5);float fX=fract(7.0*dQ);fW.y+=0.125*(7.0*dQ-fX);vec2 fY=fW+vec2(0.0,0.125);vec4 fZ=mix(texture2D(tSkySpecular,fW),texture2D(tSkySpecular,fY),fX);vec3 r=fZ.xyz*(7.0*fZ.w);return r*r;}float en(vec3 fJ,vec3 hc){float hd=dot(fJ,hc);hd=saturate(1.0+uHorizonOcclude*hd);return hd*hd;}",
        "matmicrofiber.glsl": "\n#ifdef MICROFIBER\nuniform vec4 uTexRangeFuzz;uniform vec4 uFresnelColor;uniform float uFresnelIntegral;uniform float uFresnelOcc;uniform float uFresnelGlossMask;struct ed{vec3 eh;vec3 eN;vec3 he;vec3 hf;vec3 hh;};void ef(out ed s,vec3 dI){s.eh=s.eN=ej(dI);s.he=vec3(0.0);s.hf=uFresnelColor.rgb;s.hh=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n#ifndef MICROFIBER_NO_FUZZ_TEX\nvec4 m=dM(d,uTexRangeFuzz);s.hf*=dG(m.rgb);\n#endif\n}void eM(inout ed s,float hi,vec3 eH,vec3 dI,vec3 eJ){float fk=dot(eH,dI);float eN=saturate((1.0/3.1415926)*fk);float hj=fA(fk,s.hh.z);\n#ifdef SHADOW_COUNT\neN*=hi;float hk=mix(1.0,hi,uFresnelOcc);float he=hj*hk;\n#else \nfloat he=hj;\n#endif\ns.he=he*eJ+s.he;s.eN=eN*eJ+s.eN;}void eR(out vec3 ei,out vec3 diff_extra,inout ed s,vec3 dO,vec3 dI,float dQ){s.he*=uFresnelIntegral;float fH=dot(dO,dI);vec2 hl=fG(vec2(fH,fH),s.hh.xy);s.he=s.eh*hl.x+(s.he*hl.y);s.he*=s.hf;float hm=saturate(1.0+-uFresnelGlossMask*dQ);s.he*=hm*hm;ei=s.eN;diff_extra=s.he;}\n#endif\n",
        "matsampling.glsl": "vec3 dG(vec3 c){return c*c;}vec3 dJ(vec3 n){vec3 hn=dA;vec3 ho=dB;vec3 hu=gl_FrontFacing?dC:-dC;\n#ifdef TSPACE_RENORMALIZE\nhu=normalize(hu);\n#endif\n#ifdef TSPACE_ORTHOGONALIZE\nhn-=dot(hn,hu)*hu;\n#endif\n#ifdef TSPACE_RENORMALIZE\nhn=normalize(hn);\n#endif\n#ifdef TSPACE_ORTHOGONALIZE\nho=(ho-dot(ho,hu)*hu)-dot(ho,hn)*hn;\n#endif\n#ifdef TSPACE_RENORMALIZE\nho=normalize(ho);\n#endif\n#ifdef TSPACE_COMPUTE_BITANGENT\nvec3 hv=cross(hu,hn);ho=dot(hv,ho)<0.0?-hv:hv;\n#endif\nn=2.0*n-vec3(1.0);return normalize(hn*n.x+ho*n.y+hu*n.z);}vec3 dL(vec3 t){vec3 hu=gl_FrontFacing?dC:-dC;return normalize(dA*t.x+dB*t.y+hu*t.z);}vec4 dM(vec2 hA,vec4 hB){\n#if GL_OES_standard_derivatives\nvec2 hC=fract(hA);vec2 hD=fwidth(hC);float hE=(hD.x+hD.y)>0.5?-6.0:0.0;return texture2D(tExtras,hC*hB.xy+hB.zw,hE);\n#else\nreturn texture2D(tExtras,fract(hA)*hB.xy+hB.zw);\n#endif\n}vec3 hF(sampler2D hG,vec2 hH,float hI){vec3 n=texture2D(hG,hH,hI*2.5).xyz;return dJ(n);}",
        "matshadows.glsl": "\n#ifdef SHADOW_COUNT\n#ifdef MOBILE\n#define SHADOW_KERNEL (4.0/1536.0)\n#else\n#define SHADOW_KERNEL (4.0/2048.0)\n#endif\nhighp vec4 h(highp mat4 i,highp vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}uniform sampler2D tDepth0;\n#if SHADOW_COUNT > 1\nuniform sampler2D tDepth1;\n#if SHADOW_COUNT > 2\nuniform sampler2D tDepth2;\n#endif\n#endif\nuniform highp vec2 uShadowKernelRotation;uniform highp vec2 uShadowMapSize;uniform highp mat4 uShadowMatrices[SHADOW_COUNT];uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];\n#ifndef MOBILE\nuniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];\n#endif\nhighp float hJ(highp vec3 G){\n#ifdef SHADOW_NATIVE_DEPTH\nreturn G.x;\n#else\nreturn(G.x+G.y*(1.0/255.0))+G.z*(1.0/65025.0);\n#endif\n}\n#ifndef SHADOW_COMPARE\n#define SHADOW_COMPARE(a,b) ((a) < (b) ? 1.0 : 0.0)\n#endif\n#ifndef SHADOW_CLIP\n#define SHADOW_CLIP(c,v) v\n#endif\nfloat hK(sampler2D hL,highp vec2 hA,highp float H){\n#ifndef MOBILE\nhighp vec2 c=hA*uShadowMapSize.x;highp vec2 a=floor(c)*uShadowMapSize.y,b=ceil(c)*uShadowMapSize.y;highp vec4 eE;eE.x=hJ(texture2D(hL,a).xyz);eE.y=hJ(texture2D(hL,vec2(b.x,a.y)).xyz);eE.z=hJ(texture2D(hL,vec2(a.x,b.y)).xyz);eE.w=hJ(texture2D(hL,b).xyz);highp vec4 hM;hM.x=SHADOW_COMPARE(H,eE.x);hM.y=SHADOW_COMPARE(H,eE.y);hM.z=SHADOW_COMPARE(H,eE.z);hM.w=SHADOW_COMPARE(H,eE.w);highp vec2 w=c-a*uShadowMapSize.x;vec2 s=(w.y*hM.zw+hM.xy)-w.y*hM.xy;return(w.x*s.y+s.x)-w.x*s.x;\n#else\nhighp float G=hJ(texture2D(hL,hA.xy).xyz);return SHADOW_COMPARE(H,G);\n#endif\n}highp float hN(sampler2D hL,highp vec3 hA,float hO){highp vec2 l=uShadowKernelRotation*hO;float s;s=hK(hL,hA.xy+l,hA.z);s+=hK(hL,hA.xy-l,hA.z);s+=hK(hL,hA.xy+vec2(-l.y,l.x),hA.z);s+=hK(hL,hA.xy+vec2(l.y,-l.x),hA.z);s*=0.25;return s*s;}struct ev{float eL[LIGHT_COUNT];};void eB(out ev ss,float hO){highp vec3 hP[SHADOW_COUNT];vec3 hu=gl_FrontFacing?dC:-dC;for(int k=0;k<SHADOW_COUNT;++k){vec4 hQ=uShadowTexelPadProjections[k];float hR=hQ.x*dv.x+(hQ.y*dv.y+(hQ.z*dv.z+hQ.w));\n#ifdef MOBILE\nhR*=.001+hO;\n#else\nhR*=.0005+0.5*hO;\n#endif\nhighp vec4 hS=h(uShadowMatrices[k],dv+hR*hu);hP[k]=hS.xyz/hS.w;}float m;\n#if SHADOW_COUNT > 0\nm=hN(tDepth0,hP[0],hO);ss.eL[0]=SHADOW_CLIP(hP[0].xy,m);\n#endif\n#if SHADOW_COUNT > 1\nm=hN(tDepth1,hP[1],hO);ss.eL[1]=SHADOW_CLIP(hP[1].xy,m);\n#endif\n#if SHADOW_COUNT > 2\nm=hN(tDepth2,hP[2],hO);ss.eL[2]=SHADOW_CLIP(hP[2].xy,m);\n#endif\nfor(int k=SHADOW_COUNT;k<LIGHT_COUNT;++k){ss.eL[k]=1.0;}}struct eD{highp float eE[LIGHT_COUNT];};\n#ifdef MOBILE\nvoid eG(out eD ss,float hO){for(int k=0;k<LIGHT_COUNT;++k){ss.eE[k]=1.0;}}\n#else\nhighp vec4 hT(sampler2D hL,highp vec2 hA,highp mat4 hU){highp vec4 E;E.xy=hA;\n#ifndef MOBILE\nhighp vec2 c=hA*uShadowMapSize.x;highp vec2 a=floor(c)*uShadowMapSize.y,b=ceil(c)*uShadowMapSize.y;highp vec4 hM;hM.x=hJ(texture2D(hL,a).xyz);hM.y=hJ(texture2D(hL,vec2(b.x,a.y)).xyz);hM.z=hJ(texture2D(hL,vec2(a.x,b.y)).xyz);hM.w=hJ(texture2D(hL,b).xyz);highp vec2 w=c-a*uShadowMapSize.x;vec2 s=(w.y*hM.zw+hM.xy)-w.y*hM.xy;E.z=(w.x*s.y+s.x)-w.x*s.x;\n#else \nE.z=hJ(texture2D(hL,hA.xy).xyz);\n#endif\nE=h(hU,E.xyz);E.xyz/=E.w;return E;}void eG(out eD ss,float hO){highp vec3 hV[SHADOW_COUNT];vec3 hu=gl_FrontFacing?dC:-dC;hu*=0.6;for(int k=0;k<SHADOW_COUNT;++k){vec4 hQ=uShadowTexelPadProjections[k];float hR=hQ.x*dv.x+(hQ.y*dv.y+(hQ.z*dv.z+hQ.w));\n#ifdef MOBILE\nhR*=.001+hO;\n#else\nhR*=.0005+0.5*hO;\n#endif\nhighp vec4 hS=h(uShadowMatrices[k],dv-hR*hu);hV[k]=hS.xyz/hS.w;}highp vec4 hW;\n#if SHADOW_COUNT > 0\nhW=hT(tDepth0,hV[0].xy,uInvShadowMatrices[0]);ss.eE[0]=length(dv.xyz-hW.xyz);\n#endif\n#if SHADOW_COUNT > 1\nhW=hT(tDepth1,hV[1].xy,uInvShadowMatrices[1]);ss.eE[1]=length(dv.xyz-hW.xyz);\n#endif\n#if SHADOW_COUNT > 2\nhW=hT(tDepth2,hV[2].xy,uInvShadowMatrices[2]);ss.eE[2]=length(dv.xyz-hW.xyz);\n#endif\nfor(int k=SHADOW_COUNT;k<LIGHT_COUNT;++k){ss.eE[k]=1.0;}}\n#endif\n#endif\n",
        "matskin.glsl": "\n#ifdef SKIN\n#ifndef SKIN_NO_SUBDERMIS_TEX\nuniform vec4 uTexRangeSubdermis;\n#endif\n#ifndef SKIN_NO_TRANSLUCENCY_TEX\nuniform vec4 uTexRangeTranslucency;\n#endif\n#ifndef SKIN_NO_FUZZ_TEX\nuniform vec4 uTexRangeFuzz;\n#endif\nuniform vec4 uTransColor;uniform vec4 uFresnelColor;uniform vec3 uSubdermisColor;uniform float uTransScatter;uniform float uFresnelOcc;uniform float uFresnelGlossMask;uniform float uTransSky;uniform float uFresnelIntegral;uniform float uTransIntegral;uniform float uSkinTransDepth;uniform float uSkinShadowBlur;uniform float uNormalSmooth;struct dX{vec3 hX;vec3 hY,hZ,ic,he;vec3 ec,eh,id;vec3 ie;vec3 ih;vec3 ii;vec3 ij;float ik;float il;float im;float eC;};void dZ(out dX s){vec4 m;\n#ifdef SKIN_NO_SUBDERMIS_TEX\ns.hX=uSubdermisColor;s.im=1.0;\n#else \nm=dM(d,uTexRangeSubdermis);s.hX=dG(m.xyz);s.im=m.w*m.w;\n#endif\ns.ij=uTransColor.rgb;s.ik=uTransScatter;\n#ifdef SKIN_VERSION_1\ns.eC=uSkinShadowBlur*s.im;\n#else \ns.il=max(max(s.ij.r,s.ij.g),s.ij.b)*uTransColor.a;float io=max(s.hX.r,max(s.hX.g,s.hX.b));io=1.0-io;io*=io;io*=io;io*=io;io=1.0-(io*io);s.im*=io;s.eC=uSkinShadowBlur*s.im*dot(s.hX.rgb,vec3(0.333,0.334,0.333));\n#endif\n#ifndef SKIN_NO_TRANSLUCENCY_TEX\nm=dM(d,uTexRangeTranslucency);s.ij*=dG(m.xyz);\n#endif\ns.ie=hF(tNormal,d,uNormalSmooth*s.im);vec3 iu,iv,iA;fK(iu,iv,iA,s.ie);s.eh=s.hY=iu+iv+iA;\n#ifdef SKIN_VERSION_1 \ns.ec=fQ(iu,iv,iA,vec3(1.0,0.6667,0.25),s.hX);\n#else\ns.ec=fQ(iu,iv,iA,vec3(1.0,0.6667,0.25),s.hX*0.2+vec3(0.1));\n#endif\n#ifdef SKIN_VERSION_1\nvec3 iB,iC,iD;fK(iB,iC,iD,-s.ie);s.id=fO(iB,iC,iD,vec3(1.0,0.4444,0.0625),s.ik);s.id*=uTransSky;\n#else \ns.id=vec3(0.0);\n#endif\ns.hZ=s.ic=s.he=vec3(0.0);s.hX*=0.5;s.ik*=0.5;s.ih=uFresnelColor.rgb;s.ii=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n#ifndef SKIN_NO_FUZZ_TEX\nm=dM(d,uTexRangeFuzz);s.ih*=dG(m.rgb);\n#endif\n}void eK(inout dX s,float iE,float iF,vec3 eH,vec3 dI,vec3 eJ){float fk=dot(eH,dI);float fl=dot(eH,s.ie);float eN=saturate((1.0/3.1415926)*fk);float hi=iE*iE;hi*=hi;hi=saturate(6.0*hi);\n#ifdef SKIN_VERSION_1 \nvec3 iG=fB(fl,s.hX);\n#else \nvec3 iG=fj(fk,fl,s.hX);\n#endif\nfloat iH=fA(-fl,s.ik);vec3 ic=vec3(iH*iH);\n#ifdef SKIN_VERSION_1\n#ifdef SHADOW_COUNT\nvec3 iI=vec3(iE);float iJ=saturate(hi-2.0*(iE*iE));iI+=iJ*s.hX;float iK=iE;\n#endif\n#else\n#ifdef SHADOW_COUNT\nvec3 iI;highp vec3 iL=(0.995*s.hX)+vec3(0.005,0.005,0.005);highp vec3 iM=vec3(1.0)-iL;iL=mix(iL,iM,iE);float iN=sqrt(iE);vec3 iO=2.0*vec3(1.0-iN);iN=1.0-iN;iN=(1.0-iN*iN);iI=saturate(pow(iL*iN,iO));highp float iP=0.35/(uSkinTransDepth+0.001);highp float iQ=saturate(iF*iP);iQ=saturate(1.0-iQ);iQ*=iQ;highp vec3 iR=vec3((-3.0*iQ)+3.15);highp vec3 iS=(0.9975*s.ij)+vec3(0.0025,0.0025,0.0025);highp float io=saturate(10.0*dot(iS,iS));vec3 iK=pow(iS*iQ,iR)*io;\n#else \nic=vec3(0.0);\n#endif\n#endif\nfloat hj=fA(fl,s.ii.z);\n#ifdef SHADOW_COUNT\nvec3 hk=mix(vec3(1.0),iI,uFresnelOcc);vec3 he=hj*hk;\n#else\nvec3 he=vec3(hj);\n#endif\n#ifdef SHADOW_COUNT\niG*=iI;eN*=hi;ic*=iK;\n#endif\ns.he=he*eJ+s.he;s.ic=ic*eJ+s.ic;s.hZ=iG*eJ+s.hZ;s.hY=eN*eJ+s.hY;}void eQ(out vec3 ei,out vec3 diff_extra,inout dX s,vec3 dO,vec3 dI,float dQ){s.he*=uFresnelIntegral;float fH=dot(dO,dI);vec2 hl=fG(vec2(fH,fH),s.ii.xy);s.he=s.eh*hl.x+(s.he*hl.y);s.he*=s.ih;float hm=saturate(1.0+-uFresnelGlossMask*dQ);s.he*=hm*hm;s.ic=s.ic*uTransIntegral;\n#ifdef SKIN_VERSION_1\ns.hZ=(s.hZ*fD(s.hX))+s.ec;\n#else\ns.hZ=(s.hZ*fv(s.hX))+s.ec;\n#endif\nei=mix(s.hY,s.hZ,s.im);\n#ifdef SKIN_VERSION_1\ns.ic=(s.ic+s.id)*s.ij;diff_extra=(s.he+s.ic)*s.im;\n#else\nei+=s.ic*s.il;diff_extra=s.he*s.im;\n#endif\n}\n#endif\n",
        "matstrips.glsl": "\n#ifdef STRIPVIEW\nuniform float uStrips[5];uniform vec2 uStripRes;struct dT{float io[5];float bg;};void dV(out dT iT,inout float dQ,inout vec3 dP){highp vec2 hA=gl_FragCoord.xy*uStripRes-vec2(1.0,1.0);hA.x+=0.25*hA.y;iT.io[0]=step(hA.x,uStrips[0]);iT.io[1]=step(hA.x,uStrips[1]);iT.io[2]=step(hA.x,uStrips[2]);iT.io[3]=step(hA.x,uStrips[3]);iT.io[4]=step(hA.x,uStrips[4]);iT.bg=1.0-iT.io[4];iT.io[4]-=iT.io[3];iT.io[3]-=iT.io[2];iT.io[2]-=iT.io[1];iT.io[1]-=iT.io[0];bool iU=iT.io[4]>0.0;dQ=iU?0.5:dQ;dP=iU?vec3(0.1):dP;}vec3 eX(dT iT,vec3 dI,vec3 dF,vec3 dP,float dQ,vec3 ei,vec3 el,vec3 iV){return iT.io[0]*(dI*0.5+vec3(0.5))+iT.io[1]*dF+iT.io[2]*dP+vec3(iT.io[3]*dQ)+iT.io[4]*(vec3(0.12)+0.3*ei+el)+iT.bg*iV;}\n#endif\n",
        "matvert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;uniform mat4 uSkyMatrix;uniform vec2 uUVOffset;attribute vec3 vPosition;attribute vec2 vTexCoord;attribute vec2 vTangent;attribute vec2 vBitangent;attribute vec2 vNormal;\n#ifdef VERTEX_COLOR\nattribute vec4 vColor;\n#endif\n#ifdef TEXCOORD_SECONDARY\nattribute vec2 vTexCoord2;\n#endif\nvarying highp vec3 dv;varying mediump vec2 d;varying mediump vec3 dA;varying mediump vec3 dB;varying mediump vec3 dC;\n#ifdef VERTEX_COLOR\nvarying lowp vec4 dD;\n#endif\n#ifdef TEXCOORD_SECONDARY\nvarying mediump vec2 dE;\n#endif\nvec3 iW(vec2 v){bool iX=(v.y>(32767.1/65535.0));v.y=iX?(v.y-(32768.0/65535.0)):v.y;vec3 r;r.xy=(2.0*65535.0/32767.0)*v-vec2(1.0);r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));r.z=iX?-r.z:r.z;return r;}vec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}vec3 u(mat4 i,vec3 v){return i[0].xyz*v.x+i[1].xyz*v.y+i[2].xyz*v.z;}void main(void){gl_Position=h(uModelViewProjectionMatrix,vPosition.xyz);d=vTexCoord+uUVOffset;dA=u(uSkyMatrix,iW(vTangent));dB=u(uSkyMatrix,iW(vBitangent));dC=u(uSkyMatrix,iW(vNormal));dv=h(uSkyMatrix,vPosition.xyz).xyz;\n#ifdef VERTEX_COLOR\ndD=vColor;\n#endif\n#ifdef TEXCOORD_SECONDARY\ndE=vTexCoord2;\n#endif\n}",
        "postaa.glsl": "precision mediump float;uniform sampler2D tInput;varying vec2 j;void main(void){gl_FragColor=texture2D(tInput,j);}",
        "postfrag.glsl": "precision mediump float;uniform sampler2D tInput;\n#ifdef BLOOM\nuniform sampler2D tBloom;\n#endif\n#ifdef GRAIN\nuniform sampler2D tGrain;\n#endif\n#ifdef COLOR_LUT\nuniform sampler2D tLUT;\n#endif\nuniform vec3 uScale;uniform vec3 uBias;uniform vec3 uSaturation;uniform vec4 uSharpenKernel;uniform vec3 uSharpness;uniform vec3 uBloomColor;uniform vec4 uVignetteAspect;uniform vec4 uVignette;uniform vec4 uGrainCoord;uniform vec2 uGrainScaleBias;varying vec2 j;vec3 iY(vec3 c){vec3 iZ=sqrt(c);return(iZ-iZ*c)+c*(0.4672*c+vec3(0.5328));}void main(void){vec4 jc=texture2D(tInput,j);vec3 c=jc.xyz;\n#ifdef SHARPEN\nvec3 hM=texture2D(tInput,j+uSharpenKernel.xy).xyz;hM+=texture2D(tInput,j-uSharpenKernel.xy).xyz;hM+=texture2D(tInput,j+uSharpenKernel.zw).xyz;hM+=texture2D(tInput,j-uSharpenKernel.zw).xyz;vec3 jd=uSharpness.x*c-uSharpness.y*hM;c+=clamp(jd,-uSharpness.z,uSharpness.z);\n#endif\n#ifdef BLOOM\nc+=uBloomColor*texture2D(tBloom,j).xyz;\n#endif\n#ifdef VIGNETTE\nvec2 je=j*uVignetteAspect.xy-uVignetteAspect.zw;vec3 v=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(je,je),0.0,1.0);vec3 jf=v*v;jf*=v;c*=mix(v,jf,uVignette.w);\n#endif\n#ifdef SATURATION\nfloat gray=dot(c,vec3(0.3,0.59,0.11));c=mix(vec3(gray,gray,gray),c,uSaturation);\n#endif\n#ifdef CONTRAST\nc=c*uScale+uBias;\n#endif\n#ifdef GRAIN\nfloat jh=uGrainScaleBias.x*texture2D(tGrain,j*uGrainCoord.xy+uGrainCoord.zw).x+uGrainScaleBias.y;c+=c*jh;\n#endif\n#ifdef REINHARD\n{c*=1.8;float ji=dot(c,vec3(0.3333));c=clamp(c/(1.0+ji),0.0,1.0);}\n#elif defined(HEJL)\n{const highp float jj=0.22,jk=0.3,jl=.1,jm=0.2,jn=.01,jo=0.3;const highp float ju=1.25;highp vec3 eO=max(vec3(0.0),c-vec3(.004));c=(eO*((ju*jj)*eO+ju*vec3(jl*jk,jl*jk,jl*jk))+ju*vec3(jm*jn,jm*jn,jm*jn))/(eO*(jj*eO+vec3(jk,jk,jk))+vec3(jm*jo,jm*jo,jm*jo))-ju*vec3(jn/jo,jn/jo,jn/jo);}\n#endif\n#ifdef COLOR_LUT\nc=clamp(c,0.0,1.0);c=(255.0/256.0)*c+vec3(0.5/256.0);c.x=texture2D(tLUT,c.xx).x;c.y=texture2D(tLUT,c.yy).y;c.z=texture2D(tLUT,c.zz).z;c*=c;\n#endif\ngl_FragColor.xyz=iY(c);gl_FragColor.w=jc.w;}",
        "postvert.glsl": "precision highp float;attribute vec2 vCoord;varying vec2 j;void main(void){j=vCoord;gl_Position.xy=2.0*vCoord-vec2(1.0,1.0);gl_Position.zw=vec2(0.0,1.0);}",
        "shadowfloorfrag.glsl": "precision mediump float;varying highp vec3 dv;varying mediump vec2 jv;varying mediump vec3 dC;uniform vec3 uShadowCatcherParams;\n#ifdef LIGHT_COUNT\nuniform vec4 uLightPositions[LIGHT_COUNT];uniform vec3 uLightDirections[LIGHT_COUNT];uniform vec3 uLightColors[LIGHT_COUNT];uniform vec3 uLightParams[LIGHT_COUNT];uniform vec3 uLightSpot[LIGHT_COUNT];\n#endif\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#define SHADOW_COMPARE(a,b) ((a) < (b) || (b) >= 1.0 ? 1.0 : 0.0)\n#define SHADOW_CLIP(c,v) ((c.x<0.0 || c.x>1.0 || c.y<0.0 || c.y>1.0) ? 1.0 : v)\n#include <matshadows.glsl>\nvoid main(void){ev eA;eB(eA,SHADOW_KERNEL);vec3 jA=vec3(0.0,0.0,0.0);vec3 jB=vec3(0.0,0.0,0.0);for(int k=0;k<SHADOW_COUNT;++k){vec3 eH=uLightPositions[k].xyz-dv*uLightPositions[k].w;float eI=inversesqrt(dot(eH,eH));eH*=eI;float a=saturate(uLightParams[k].z/eI);a=1.0+a*(uLightParams[k].x+uLightParams[k].y*a);float s=saturate(dot(eH,uLightDirections[k]));s=saturate(uLightSpot[k].y-uLightSpot[k].z*(1.0-s*s));vec3 jC=mix(uLightColors[k].xyz,vec3(1.0,1.0,1.0),uShadowCatcherParams.x);vec3 jD=(a*s)*jC;jD*=saturate(dot(eH,dC));jB+=jD;jA+=jD*eA.eL[k];}float jE=1.0e-4;vec3 r=(jA+jE)/(jB+jE);float jF=saturate(dot(jv,jv))*uShadowCatcherParams.z;r=mix(r,vec3(1.0,1.0,1.0),jF);r=mix(vec3(1.0,1.0,1.0),r,uShadowCatcherParams.y);gl_FragColor.xyz=r;gl_FragColor.w=1.0;}",
        "shadowfloorvert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;uniform mat4 uModelSkyMatrix;uniform float uScale;attribute vec3 vPosition;varying highp vec3 dv;varying mediump vec2 jv;varying mediump vec3 dC;vec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}void main(void){jv=vPosition.xz;dC=normalize(uModelSkyMatrix[1].xyz);dv=h(uModelSkyMatrix,vPosition).xyz;gl_Position=h(uModelViewProjectionMatrix,vPosition);}",
        "shadowfrag.glsl": "precision highp float;varying vec2 jG;\n#ifdef ALPHA_TEST\nvarying mediump vec2 d;uniform sampler2D tAlbedo;\n#endif\nvec3 jH(float v){vec4 jI=vec4(1.0,255.0,65025.0,16581375.0)*v;jI=fract(jI);jI.xyz-=jI.yzw*(1.0/255.0);return jI.xyz;}void main(void){\n#ifdef ALPHA_TEST\nfloat e=texture2D(tAlbedo,d).a;if(e<0.5){discard;}\n#endif\n#ifdef SHADOW_NATIVE_DEPTH\ngl_FragColor.xyz=vec3(0.0,0.0,0.0);\n#else\ngl_FragColor.xyz=jH((jG.x/jG.y)*0.5+0.5);\n#endif\ngl_FragColor.w=0.0;}",
        "shadowvert.glsl": "precision highp float;attribute vec3 vPosition;attribute vec2 vTexCoord;uniform mat4 uMeshTransform;uniform mat4 uViewProjection;varying vec2 jG;\n#ifdef ALPHA_TEST\nvarying mediump vec2 d;uniform vec2 uUVOffset;\n#endif\nvec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}void main(void){vec3 p=h(uMeshTransform,vPosition).xyz;gl_Position=h(uViewProjection,p);jG=gl_Position.zw;\n#ifdef ALPHA_TEST\nd=vTexCoord+uUVOffset;\n#endif\n}",
        "sky.glsl": "precision highp float;uniform sampler2D tSkyTexture;uniform float uAlpha;varying vec2 d;void main(void){vec3 r=texture2D(tSkyTexture,d).xyz;gl_FragColor.xyz=r*r;gl_FragColor.w=uAlpha;}",
        "skySH.glsl": "precision mediump float;uniform vec4 uSkyCoefficients[9];uniform float uAlpha;varying vec3 jJ;void main(void){vec3 G=normalize(jJ);vec3 r=uSkyCoefficients[0].xyz;r+=uSkyCoefficients[1].xyz*G.y;r+=uSkyCoefficients[2].xyz*G.z;r+=uSkyCoefficients[3].xyz*G.x;vec3 swz=G.yyz*G.xzx;r+=uSkyCoefficients[4].xyz*swz.x;r+=uSkyCoefficients[5].xyz*swz.y;r+=uSkyCoefficients[7].xyz*swz.z;vec3 sqr=G*G;r+=uSkyCoefficients[6].xyz*(3.0*sqr.z-1.0);r+=uSkyCoefficients[8].xyz*(sqr.x-sqr.y);gl_FragColor.xyz=r;gl_FragColor.w=uAlpha;}",
        "skyvert.glsl": "precision highp float;uniform mat4 uInverseSkyMatrix;uniform mat4 uViewProjection;attribute vec3 vPosition;attribute vec2 vTexCoord;\n#if SKYMODE == 3\nvarying vec3 jJ;\n#else\nvarying vec2 d;\n#endif\nvec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}vec4 u(mat4 i,vec3 v){return i[0]*v.x+i[1]*v.y+i[2]*v.z;}void main(void){vec3 p=h(uInverseSkyMatrix,vPosition).xyz;gl_Position=u(uViewProjection,p);gl_Position.z-=(1.0/65535.0)*gl_Position.w;\n#if SKYMODE == 3\njJ=vPosition;jJ.xy+=1e-20*vTexCoord;\n#else\nd=vTexCoord;\n#endif\n}",
        "wirefrag.glsl": "precision highp float;uniform vec4 uStripParams;void main(void){vec2 c=gl_FragCoord.xy*uStripParams.xy-vec2(1.0,1.0);c.x+=0.25*c.y;float a=c.x<uStripParams.z?0.0:0.9;a=c.x<uStripParams.w?a:0.0;gl_FragColor=vec4(0.0,0.0,0.0,a);}",
        "wirevert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;attribute vec3 vPosition;vec4 h(mat4 i,vec3 p){return i[0]*p.x+(i[1]*p.y+(i[2]*p.z+i[3]));}void main(void){gl_Position=h(uModelViewProjectionMatrix,vPosition);gl_Position.z+=-0.00005*gl_Position.w;}",
        nil: ""
    };
})(marmoset);