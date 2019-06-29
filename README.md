功能说明
==========

引入方式
---------

        <script src="xxx/ThumbMaps.js"></script> 或
        import ThumbMaps from 'xxx/ThumbMaps.js'

        let thumbmaps = new ThumbMaps();

属性
---------

    fileHeader
        thumbmaps.fileHeader  //初始化后可以访问
    
    url
        thumbmaps.url    //初始化后可以访问
    
方法
---------
    setUrl 初始化文件
        thumbmaps.setUrl('ths文件地址', (header)=>{
            header为文件头信息 若为null,则表示解析头部失败

            //header对象结构
            {
                imgNum:100 ,//图片数量
                width:96, //图片的宽度
                height:54, //图片的高度
                bytes:xxx,//图片总字节数
                names:[
                    {
                        name:0, //图片名字，默认为毫秒时间，数值
                        error:0, //0表示这张图片正常，1表示这张图片在抽取过程中可能遇到解码失败，填了黑色或者其它方式
                    }
                    ...
                ]
            }
        })
    
    getObjectURLs  获取图片对象例表

        selectNames = [0,1000,2000,8000,9000......] 传入的图片名字数组
        thumbmaps.getObjectURLs(selectNames,(arr)=>{

            arr 结构  以名字（时间）排序后的数组对象
            [
                {
                    name:0,
                    url:'xxxx'
                }
                .....
            ]
        })

    destroy  释放缓存及图片产生的内存

    