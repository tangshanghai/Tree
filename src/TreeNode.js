class TreeNode{
    constructor(data,_layerIndex,config){
        this.nodeData = data;
        this.layerIndex = _layerIndex;
        this.config = config;

        this.root = document.createElement('li');
        this.root.classList.add('tree-node');
        this.root.innerHTML = `<div class="node-content">
                                    <span class="icon-arrow open">
                                        <span class="icon-triangle"></span>
                                    </span>
                                    <span class="icon-type"></span>
                                    <span class="node-word"></span>
                                </div>
                                <ul class="node-children"></ul>`;
        this.nodeChildren = [];
        this.ele_nodeCon = this.root.querySelector(".node-content");
        this.ele_iconArrow = this.root.querySelector(".icon-arrow");
        this.ele_iconType = this.root.querySelector(".icon-type");
        this.ele_nodeWord = this.root.querySelector(".node-word");
        this.ele_nodeChildren = this.root.querySelector(".node-children");

        this.ele_nodeCon.style.paddingLeft = (this.layerIndex*config.indent) + 'px';
        this.ele_nodeCon.style.height = config.itemHeight+'px';
        if(config.typesrc){
            this.ele_iconType.style.background = "url("+config.typesrc+")";
        }
        this.ele_nodeWord.innerHTML = this.nodeData.label;
        this.ele_nodeWord.setAttribute("title",this.nodeData.label);
        this.ele_nodeWord.style.fontSize = config.fontSize+'px';

        let childrenData = this.nodeData.children || [];
        for(let i=0;i<childrenData.length;i++){
            let item = childrenData[i];
            let newNode = new TreeNode(item,this.layerIndex+1,config);
            this.ele_nodeChildren.appendChild(newNode.root);
            this.nodeChildren.push(newNode);
        }

        if(this.nodeData.isLeaf){
            this.ele_iconArrow.style.visibility = "hidden";
        }
        this.nodeData.isOpen?this.openNode():this.closeNode();

        this.ele_iconArrow.addEventListener('click',this.iconClickHandler);
        this.ele_iconType.addEventListener('dblclick',this.dbClickHandler);
        this.ele_nodeWord.addEventListener('dblclick',this.dbClickHandler);
        this.ele_nodeCon.addEventListener('click',this.conClickHandler);
    }

    /** 展开子节点 */
    openNode = (isAll)=>{
        this.ele_iconArrow.classList.add('open');
        this.ele_nodeChildren.classList.add('open');
        if(isAll){
            for(let i=0;i<this.nodeChildren.length;i++){
                let item = this.nodeChildren[i];
                item.openNode(true,isAll);
            }
        }
        this.nodeData.isOpen = true;
    }
    /** 关闭子节点 */
    closeNode = (isAll) =>{
        this.ele_iconArrow.classList.remove('open');
        this.ele_nodeChildren.classList.remove('open');
        if(isAll){
            for(let i=0;i<this.nodeChildren.length;i++){
                let item = this.nodeChildren[i];
                item.closeNode(isAll);
            }
        }
        this.nodeData.isOpen = false;
    }

    /** 设置选中 */
    setSelected =(isSelected)=>{
        if(isSelected){
            this.ele_nodeCon.classList.add('selected');
        }else{
            this.ele_nodeCon.classList.remove('selected');
        }
    }
    /** 更新子节点数据 */
    updateChildren = (_newNodes) =>{
        for(let i=0;i<this.nodeChildren.length;i++){
            let itemNode = this.nodeChildren[i];
            itemNode.destroy();
        }
        this.ele_nodeChildren.innerHTML = '';
        this.nodeChildren = [];
        this.nodeData.children = _newNodes;
        for(let i=0;i<_newNodes.length;i++){
            let item = _newNodes[i];
            let newNode = new TreeNode(item,this.layerIndex+1,this.config);
            this.ele_nodeChildren.appendChild(newNode.root);
            this.nodeChildren.push(newNode);
        }
        if(this.nodeData.isLeaf){
            this.ele_iconArrow.style.visibility = "hidden";
        }else{
            this.ele_iconArrow.style.visibility = "visible";
        }
        // this.nodeData.isOpen?this.openNode():this.closeNode();
    }

    /** 三角形点击 */
    iconClickHandler = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        if(this.nodeData.isOpen){
            this.closeNode();
        }else{
            this.openNode();
        }
        
        if(this.config.iconclickCallBack){
            this.config.iconclickCallBack(this.nodeData);
        }
    }
    /** 双击图标或者文字 */
    dbClickHandler = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        if(this.nodeData.isOpen){
            this.closeNode();
        }else{
            this.openNode();
        }
        if(this.config.dblclickCallBack){
            this.config.dblclickCallBack(this.nodeData);
        }
    }
    /** 单击整个行 */
    conClickHandler = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        if(this.config.clickCallBack){
            this.config.clickCallBack(this.nodeData);
        }
    }


    /** 销毁节点 */
    destroy=(isChildren = true)=>{
        this.ele_iconArrow.removeEventListener('click',this.iconClickHandler);
        this.ele_iconType.removeEventListener('dblclick',this.dbClickHandler);
        this.ele_nodeWord.removeEventListener('dblclick',this.dbClickHandler);
        this.ele_nodeCon.removeEventListener('click',this.conClickHandler);

        if(isChildren){
            for(let i=0;i<this.nodeChildren.length;i++){
                let itemNode = this.nodeChildren[i];
                itemNode.destroy(isChildren);
            }
        }
    }
}
export default TreeNode;