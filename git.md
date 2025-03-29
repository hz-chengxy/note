# git 命令
## 设置用户名、邮箱
git config --global user.name ** 设置用户名
git config --global user.email ** 设置用户邮箱

## git 查看提交代码时的名字与邮箱
git config user.name
git config user.email

## git 更换用户名密码
window中搜索凭据管理器 —> windows凭据
git:https://git.trscd.com.cn

## 生成本地密码（与远程仓库做链接时需要）
ssh-keygen -t rsa -C 535964113@qq.com 

## git 防止拉取文件名太长而拉取失败，忽略名字过长的问题
错误提示：error: Filename too long
Git config –-global core.longpaths true

## git clone 克隆下载项目
git clone url
git clone -b branch url

## git 取别名
git config --global alias.st status 取别名，将status改名为st

## git status 查新
git status(st)  检查有无新东西可以上传

## git add 追踪文件
git add .   追踪目录下所有的文件
git add app/   追踪app/目录下所有的文件

## git commit -m 'test' 带注释提交到本地仓库
提交到本地仓库，并加上注释test
* git commit --amend -m "" 替代上一次commit的注释

## git push 推至远程仓库

## git pull 拉取代码
git pull origin branch

## git branch 查看分支

## git branch ** 新建一个分支

## git checkout ** 到某个分支去
git checkout -b cxy 新建一个cxy分支并直接切换到那个分支

## 把本地仓库和远端的仓库关联
git remote add origin git@github.com:migu-y/miguMusic.git   

## 本地的master和远程的origin master做连接
git branch --set-upstream-to=origin/master master

## 查看remote地址、远程分支和本地分支与之相对应关系等信息。
git remote show origin：*查看remote地址、远程分支和本地分支与之相对应关系等信息。*

## 回滚
### git log 查看可以回滚的目录
### git reset 351357351(特殊的hash值的前几位) --hard   会滚动某个节点

## git stash
* 1、 当正在dev分支上开发某个项目，这时项目中出现一个bug，需要紧急修复，但是正在开发的内容只是完成一半，还不想提交，这时可以用git stash命令将修改的内容保存至堆栈区，然后顺利切换到hotfix分支进行bug修复，修复完成后，再次切回到dev分支，从堆栈中恢复刚刚保存的内容。

* 2、 由于疏忽，本应该在dev分支开发的内容，却在master上进行了开发，需要重新切回到dev分支上进行开发，可以用git stash将内容保存至堆栈中，切回到dev分支后，再次恢复内容即可。

* 总的来说，git stash命令的作用就是将目前还不想提交的但是已经修改的内容进行保存至堆栈中，后续可以在某个分支上恢复出堆栈中的内容。这也就是说，stash中的内容不仅仅可以恢复到原先开发的分支，也可以恢复到其他任意指定的分支上。git stash作用的范围包括工作区和暂存区中的内容，也就是说没有提交的内容都会保存至堆栈中。

### git stash save “test1”
作用等同于git stash，区别是可以加一些注释

### git stash list
查看当前stash中的内容

### git stash pop
将当前stash中的内容弹出，并应用到当前分支对应的工作目录上。
注：该命令将堆栈中最近保存的内容删除（栈是先进后出）

### git stash apply
将堆栈中的内容应用到当前目录，不同于git stash pop，该命令不会将内容从堆栈中删除，也就说该命令能够将堆栈的内容多次应用到工作目录中，适应于多个分支的情况。可以使用git stash apply + stash名字（如stash@{1}）指定恢复哪个stash到当前的工作目录。

### git stash drop + 名称
从堆栈中移除某个指定的stash

### git stash clear
清除堆栈中的所有 内容

## git fetch
从远程获取代码库
git pull 和 git fetch 这两个命令都可以用于下载远端仓库。你可以认为git fetch是这两者中更加安全的那个，即便下载了远端的内容，但也不会更新你本地仓库的版本状态，以保证你本地当前代码完好无损。反观git pull命令则是一个更加激进的命令，它会下载当前正在工作的分支对应的远端内容，并且在下载成功之后马上执行一个git merge命令，为新下载下来的远端内容创建一次merge commit。此时如果你有正在进行中的工作还没准备好进行合并，这些行为可能会造成代码冲突，然后马上进入合并代码过程中解决冲突的流程。

## git cherry-pick commitID
将某一个分支上的某个commit合并到当前分支，直接填写commitID的那个Hash值就行，因为每个分支哪怕是相同的提交，id都不一样。

cherry-pick和merge的区别：
merge是全部提交都会合并，而cherry-pick是可以选择固定的commit提交

git cherry-pick A..B
上面命令可以转移从 A 到 B 的所有提交。它们必须按照正确的顺序放置：提交 A 必须早于提交 B，否则命令将失败，但不会报错。

注意，使用上面的命令，提交 A 将不会包含在 Cherry pick 中。如果要包含提交 A，可以使用下面的语法。
git cherry-pick A^..B

## git cherry-pick --abort
发生代码冲突后，放弃合并，回到操作前的样子。

# 一个仓库的不同分支合并代码
Git 的 clone 命令会为你自动将远程主机命名为 origin，拉取它的所有数据，创建一个指向它的 master 分支的指针，并且在本地将其命名为 origin/master。
* 1、git fetch origin 从远程获取代码库
* 2、git cherry-pick commitID  :  将某一个分支上的某个commit合并到当前分支
* 3、解决冲突 git push

# 不同仓库合并代码
* 1、git fetch origin 从远程origin获取代码库
* 2、切换现有仓库的分支到目标分支（Git checkout zmy）, 
* 3、添加新的的远程仓库，取名为upstream：Git remote add upstream url,
* 4、git remote -v 查看远程仓库信息，查看新建的upstream存在不存在
* 5、Git fetch upstream 从远程upstream获取代码库
* 6、将upstream远程仓库的zmy合并到现有仓库的zmy（Git merge upstream/zmy），
* 7、push到现有仓库（如果有冲突先解决冲突提交），
* 8、切换本地代码到开发分支（Git checkout **），
* 9、合并现有仓库zmy(Git merge zmy)
