# 如何定制自己的angular cli

1. fork官方库，并clone到本地
1. 修改源码，主要的文件都在`packages/@angular/cli`下，其中webpack配置位于`packages/@angular/cli/models`下
1. 修改`packages/@angular/cli/blueprints/ng/files/package.json`的`devDependencies/"@angular/cli"`，指向你准备发布到的仓库，如`git+https://github.com/asnowwolf/ng-cli-2.git#v<%= version %>`
1. 运行`npm run build`命令，构建出自己的版本。
1. 把`dist/@angular/cli`目录上传到某个独立的git仓库，如`https://github.com/asnowwolf/ng-cli-2`：初始化、添加、提交、打上tag，并使用`git push --tags`推送上去。
1. 在开发者电脑上运行`npm i -g https://github.com/asnowwolf/ng-cli-2.git\#v1.1.1`（把url部分替换成你自己的发布位置）

这样你本地的cli就是定制版了。