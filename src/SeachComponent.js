
class SeachComponent{
    constructor(callback,config){
        let tempdiv = document.createElement('div');
        tempdiv.innerHTML = `<div class="seach-component">
            <div class="seach-com-box">
                <input type="text" class="find-text" placeholder="搜索频道"/>
                <div class="btn-groups">
                    <label class="case-sensitive" title="区分大小写">
                        <input type="checkbox" name="case-sensitive" class="case-sensitive"/>
                        <span class="icon">Aa</span>
                    </label>

                    <label class="case-remote" title="本地/远程">
                        <input type="checkbox" name="case-remote" class="case-remote"/>
                        <span class="icon">Lo</span>
                    </label>
                </div>
            </div>
        </div>`;
        this.root = tempdiv.children[0];//tempdiv.querySelector('.seach-component');
        // console.log(this.root,tempdiv)
        this.callback = callback;
        this.findText = this.root.querySelector('.find-text');
        this.caseSensitive = this.root.querySelector('.case-sensitive');
        this.caseRemote = this.root.querySelector('.case-remote');
        this.findText.setAttribute('placeholder',config.seachPlaceholder);

        this.data = {
            findTxt: '',
            isCaseSensitive: false,
            isRemote: false
        }
        this.findText.addEventListener('input',this.findTextHandler);
        this.findText.addEventListener('change',this.findTextChanged);
        this.caseSensitive.addEventListener('change',this.checkboxChanged);
        this.caseRemote.addEventListener('change',this.checkboxChanged2);
        // this.findText.on('input propertychange',this.findTextHandler);
        // this.findText.on('change',this.findTextChanged);
        // this.caseSensitive.on('change',this.checkboxChanged);
    }

    /**
     * 查找文字input事件
     */
    findTextHandler =()=>{
        this.data.findTxt = this.findText.value;

        this.callback(this.data);
    }
    /**
     * 查找文字change事件
     */
    findTextChanged =()=>{
        // this.data.findTxt = this.findText.val();
    }
    /**
     * checkboxChanged
     */
    checkboxChanged = (event) =>{
        this.data.isCaseSensitive = event.target.checked;
        this.callback(this.data);
    }

    checkboxChanged2 = (event) =>{
        this.data.isRemote = event.target.checked;
        this.callback(this.data);
    }
    
    show(){
        this.root.style.display = 'block';
    }
    hide(){
        this.root.style.display = 'none';
    }

}
export default SeachComponent;