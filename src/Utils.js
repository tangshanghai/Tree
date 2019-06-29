
class Utils{
    constructor(){

    }

    GUID(){
        let t = (new Date).getTime();
        return "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){
            let n=(t+16*Math.random())%16|0;
            t=Math.floor(t/16);
            return ("x"==e?n:3&n|8).toString(16);
        });
    }
    //返回body最大的z-index
    getMaxZindex() {
        let elementObj = document.body;
        //取得容器节点下第一层所有节点
        let childNodes = elementObj.children || elementObj.childNodes;
        let zIndex = 0;
        for (let i = 0; i < childNodes.length; i++) {
            let node = childNodes[i];
            let ti1 = parseInt(this.getClass(node, "z-index"));
            let ti2 = parseInt(node.style.zIndex);
            let ti = ti2 || ti1;
            if (isNaN(ti)) continue;
            if (ti > zIndex) zIndex = ti;
        }
        zIndex += 10;
        return zIndex;
    }

    getClass(obj, name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name]; //IE下获取非行间样式
        } else {
            return getComputedStyle(obj, false)[name]; //FF、Chorme下获取非行间样式
        }
    }

}

export default new Utils;