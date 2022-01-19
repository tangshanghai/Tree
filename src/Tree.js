import TreeNode from './TreeNode.js';
import SeachComponent from './SeachComponent.js';
import './Tree.less';
console.log('==============Tree 0.0.3=================')
class Tree{
    constructor(data,config){

        this.treeData = data;
        //复制一份数据
        this.copyTreeData = JSON.parse(JSON.stringify(this.treeData));
        this.config = Object.assign({
            indent:10,
            itemHeight: 20,
            fontSize: 12,
            width: '100%',
            isSeach: false,
            seachPlaceholder: '搜索节点'
        },config); 
        this.callBacks = [];

        this.root = document.createElement('div');
        this.root.classList.add('tree-tsh');
        this.seachCom = new SeachComponent(this.seachBack,this.config);
        this.root.appendChild(this.seachCom.root);

        let ele_ul = this.ele_ul = document.createElement('ul');
        this.root.appendChild(ele_ul);

        this.config.clickCallBack = this.clickCallBack;
        this.config.dblclickCallBack = this.dblclickCallBack;
        this.config.iconclickCallBack = this.iconclickCallBack;
        this.root.style.width = this.config.width;

        this.nodeChildren = [];
        for(let i=0;i<this.treeData.length;i++){
            let newNode = new TreeNode(this.treeData[i],0,this.config);
            ele_ul.appendChild(newNode.root);
            this.nodeChildren.push(newNode);
        }

        if(!this.config.isSeach){
            this.seachCom.hide();
        }
        this.findData = this.seachCom.data;
    }

    /** 重置所有节点数据 */
    resetTreeData = (newTreeData,isCopy = true) =>{
        for(let i=0;i<this.nodeChildren.length;i++){
            let itemNode = this.nodeChildren[i];
            itemNode.destroy();
        }
        // function destroy(nodeChildren){
        //     for(let i=0;i<nodeChildren.length;i++){
        //         let itemNode = nodeChildren[i];
        //         itemNode.destroy();
        //         destroy(itemNode.nodeChildren);
        //     }
        // }
        // destroy(this.nodeChildren);
        // console.log('重置所有节点数据',isCopy)

        this.ele_ul.innerHTML = '';
        this.nodeChildren = [];
        this.treeData = newTreeData;
        if(isCopy){
            //复制一份数据
            this.copyTreeData = JSON.parse(JSON.stringify(this.treeData));
        }
        
        for(let i=0;i<this.treeData.length;i++){
            let newNode = new TreeNode(this.treeData[i],0,this.config);
            this.ele_ul.appendChild(newNode.root);
            this.nodeChildren.push(newNode);
        }
    }

    /** 重置拷贝数据 */
    resetCopyData = () =>{
        //复制一份数据
        this.copyTreeData = JSON.parse(JSON.stringify(this.treeData));
    }

    /** 单击事件返回 */
    clickCallBack = (_node) =>{
        // console.log('单击事件返回',_node.label)

        this.chooseNodeOfId(_node.id);

        this.dispatchEvent('select-node',_node);
    }

    /** 双击事件返回 */
    dblclickCallBack = (_node) =>{
        // console.log('双击事件返回',_node.label)
        this.dispatchEvent('dblclick-node',_node);
    }

    /** icon事件返回 */
    iconclickCallBack = (_node) =>{
        // console.log('icon事件返回',_node.label)
        this.dispatchEvent('expand-node',_node);
    }

    /** 搜索返回事件 */
    seachBack = (data) =>{
        console.log('搜索返回事件',data)
        this.findData = data;
        //本地搜索
        if(!data.isRemote){
            let newTreeData = this.findTreeData(this.copyTreeData,this.findData);
            this.resetTreeData(newTreeData,false);
        }else{
            this.dispatchEvent('seach-node',data);
        }
    }

    /** 查找树节点 */
    findTreeData = (rawTreeData,config) =>{
        let findTxt = config.findTxt;
        if(findTxt === ''){
            console.log('rawTreeData',rawTreeData)
            return rawTreeData;
        }
        if(!config.isCaseSensitive && config.findTxt){
            findTxt = findTxt.toLocaleLowerCase();
        }
        function findTree(data,_findedData){
            for(let i=0;i<data.length;i++){
                let item = data[i];
                let curWord = item.label;
                if(!config.isCaseSensitive){
                    curWord = curWord.toLocaleLowerCase();
                }
                if(curWord.indexOf(findTxt)>-1){
                    item.isOpen = true;
                    _findedData.push(item);
                }else{
                    findTree(item.children,_findedData);
                }
            }
        }
        let findedData = [];
        findTree(rawTreeData,findedData);
        return findedData;
    }

    /** 展开或关闭所有树 */
    openAndCloseAll = (isOpen) =>{
        for(let i=0;i<this.nodeChildren.length;i++){
            let itemNode = this.nodeChildren[i];
            if(isOpen){
                itemNode.openNode(true);
            }else{
                itemNode.closeNode(true);
            }
        }
    }
    /** 展开某一个节点 */
    openNodeOfId =(id)=>{
        function openNodeId(nodeChildren){
            for(let i=0;i<nodeChildren.length;i++){
                let itemNode = nodeChildren[i];
                if(itemNode.nodeData.id == id){
                    itemNode.openNode();
                    return;
                }else{
                    openNodeId(itemNode.nodeChildren);
                }
            }
        }
        openNodeId(this.nodeChildren);
    }

    /** 选中某一个节点 */
    chooseNodeOfId =(id,isexpand = true)=>{
        function setSelected(nodeChildren){
            let isCur = false;
            for(let i=0;i<nodeChildren.length;i++){
                let itemNode = nodeChildren[i];
                let tempIsCur = itemNode.nodeData.id == id;
                itemNode.setSelected(tempIsCur); 
                let calcCur = setSelected(itemNode.nodeChildren);
                if(!isCur && (tempIsCur || calcCur)) isCur = true; 
                if(calcCur && isexpand){
                    itemNode.openNode();
                }
            }
            return isCur;
        }
        setSelected(this.nodeChildren);
    }
    /** 更新某一个节点的子级数据 */
    updateTreeNodeOfId(id,nodedatas){
        if(!nodedatas || nodedatas.length===0) return;
        function findNodeId(nodeChildren){
            let curNode = null;
            for(let i=0;i<nodeChildren.length;i++){
                let itemNode = nodeChildren[i];
                if(itemNode.nodeData.id == id){
                    curNode = itemNode;
                    break;
                }else{
                    curNode = findNodeId(itemNode.nodeChildren);
                    if(curNode) break;
                }
            }
            return curNode;
        }
        let curNodeObj = findNodeId(this.nodeChildren);
        if(curNodeObj){
            curNodeObj.updateChildren(nodedatas);
        }
        // console.log('找到的子级点数据',curNodeObj)
        //复制一份数据
        this.copyTreeData = JSON.parse(JSON.stringify(this.treeData));
    }


    addEventListener = (type,callback) =>{
        this.callBacks.push({
            type:type,
            callback:callback
        })
    }

    removeEventListener=(type,callback) =>{
        for(let i = 0;i<this.callBacks.length;i++){
            let temp = this.callBacks[i];
            if(temp.type == type && temp.callback === callback){
                this.callBacks.splice(i,1);
                break;
            }
        }
    }

    dispatchEvent=(type,parameter) =>{
        let tellArr = [];
        for(let i = 0;i<this.callBacks.length;i++){
            let temp = this.callBacks[i];
            if(temp.type == type){
                tellArr.push(temp);
            }
        }
        for(let i=0;i<tellArr.length;i++){
            let temp = tellArr[i];
            temp.callback(parameter);
        }
    }

    /** 销毁 */
    destroy=()=>{
        for(let i=0;i<this.nodeChildren.length;i++){
            let itemNode = this.nodeChildren[i];
            itemNode.destroy();
        }
        this.ele_ul.innerHTML = '';
        this.nodeChildren = [];

        if(this.root.parentNode){
            this.root.parentNode.removeChild(this.root);
        }
    }
}



export default Tree;