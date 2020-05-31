import { padLeft } from "./util";
import { Color } from "three";

// deprecate this in favor of THREE.Color everywhere
const AppColor = function(){
    function AppColor(input) {
        let r, g, b;
        switch(input && input.constructor && input.constructor.name) {
            case 'Array':
                [ r, g, b ] = input;
                break;
            case 'String':
                [ r, g, b ] = fromHexString(input);
                break;
            default:
                throw new Error(`Invalid input type ${typeof input} for RGB Color`);
        }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    function fromHexString(input) {
        const i = parseInt(input.replace(/#/, '0x'));
        const [r,g,b] = [
            (i & 0xff0000) >> 0x10,
            (i & 0x00ff00) >> 0x8,
            (i & 0x0000ff),
        ];
        return [r,g,b];
    }
    Object.assign(AppColor.prototype, {
        toString: function() {
            const { r, g, b } = this;
            return `rgb(${r},${g},${b})`;
        },
        toHexString: function() {
            const { r, g, b } = this;
            const hexString = ((r << 16) + (g << 8) + b).toString(16);
            return `#${ padLeft(hexString, 6) }`;
        },
        toRGBVector: function() {
            const { r, g, b } = this;
            return [ r, g, b ];
        },
        compare: function(otherColor) {
            const { r, g, b } = this;
            const [ _r, _g, _b ] = [ otherColor.r, otherColor.g, otherColor.b ];
            return ([r,g,b] < [_r,_g,_b]) ? -1 : ([r,g,b] > [r,g,b]) ? 1 : 0;
        }
    });
    return AppColor;
}();

export default AppColor;
