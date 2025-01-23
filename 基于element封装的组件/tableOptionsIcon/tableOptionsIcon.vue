<template>
  <span class="table-options-icon" @click.prevent.stop="closePopover">
     <component
     :is="icon.tagName || outTagName"
     v-for="(icon, key) in icons" :key="key"
     v-bind="getBindAttr(icon)"
     @click="({ noShowConfirm }) => executeFunc((icon.args || []), icon.confirmMsg, icon.clickCallBack, noShowConfirm)"/>
     <el-dropdown
     :disabled="dropdownDisabled"
     @command="(command) => handleCommand(command)"
     @visible-change="visibleChange"
     @click.prevent.stop="closePopover"
     :trigger="trigger" v-if="dropdownItems && dropdownItems.length">
        <span class="el-dropdown-link">
           <slot>
             <w-icon size="mini" icon="icon-more"></w-icon>
           </slot>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(icon, key) in dropdownItems" :key="key" :command="key" icon="" v-bind="getBindAttr(icon)">
              <slot name="dropdown-item" :row-data="rowData" :item="icon">{{ $t(icon.text) }}</slot>
            </el-dropdown-item>
        </el-dropdown-menu>
     </el-dropdown>
  </span>
</template>

<script>
import { noop } from 'lodash'
import TableButton from './tableButton.vue'

export default {
  components: { TableButton },
  name: 'tableOptionsIcon',
  props: {
    // 按钮组
    buttons: {
      type: Array,
      default: () => [],
      required: true,
      // 按钮类型
      typ: {
        type: String,
        default: ''
      },
      // 图标
      icon: {
        type: String,
        default: 'icon-add'
      },
      // 展示文字
      text: {
        type: String,
        default: 'button.edit'
      },
      // 点击时回调函数
      clickCallBack: {
        type: Function,
        default: noop
      },
      // 携带额外参数
      args: {
        type: Array,
        default: () => []
      }
    },
    // 需要国际化的字段
    needTransform: {
      type: Array,
      default: () => ['text']
    },
    // 外部展示组件
    outTagName: {
      type: String,
      default: 'w-icon'
    },
    // 绑定至外部组件需要的属性
    bindAttr: {
      type: Array,
      default: () => ['tip:text', 'icon', 'disabled', 'confirmMsg']
    },
    // 按钮传参
    rowData: {
      type: [Object, Array],
      default: () => {}
    },
    // 下拉触发方式
    trigger: {
      type: String,
      default: 'hover'
    },
    // 展示icon按钮数
    showIconNum: {
      type: Number,
      default: 3
    }
  },
  computed: {
    // 计算隐藏后的按钮数
    computedButtons () {
      const buttons = this.buttons.filter(item => (!item.hide || (item.hide && typeof item.hide === 'function' && !item.hide(this.rowData))))
      return buttons
    },
    // 下拉全部禁用时禁用
    dropdownDisabled () {
      const { dropdownItems = [], rowData } = this
      const list = dropdownItems.filter(item => {
        if ((typeof item.disabled === 'function' && item.disabled.call(rowData)) || item.disabled === true) {
          return true
        }
        return false
      })
      return list.length === dropdownItems.length && list.length > 0
    },
    // icon列表
    icons () {
      const { computedButtons = [], showIconNum } = this
      let list = computedButtons.length > showIconNum ? computedButtons.slice(0, showIconNum - 1) : computedButtons
      return list
    },
    // 下拉列表
    dropdownItems () {
      const { computedButtons = [], showIconNum } = this
      return computedButtons.length > showIconNum ? computedButtons.slice(showIconNum - 1) : []
    },
    // 下拉函数
    dropdownItemsFunc () {
      const obj = {}
      this.dropdownItems.forEach((element, index) => {
        obj[index] = element
      })
      return obj
    }
  },
  methods: {
    visibleChange () {
      this.$platform.closeHeaderPopover && this.$platform.closeHeaderPopover()
    },
    closePopover () {
      this.visibleChange()
    },
    getBindAttr (icon) {
      const bind = {}
      let { bindAttr, needTransform = [] } = this
      bindAttr = icon.bindAttr || bindAttr || []
      bindAttr.forEach((name = '') => {
        const [s, e = s] = name.split(':')
        bind[s] = needTransform.includes(e) ? this.$t(icon[e]) : (typeof icon[e] === 'function' ? icon[e].call(this.rowData) : icon[e])
      })
      return bind
    },
    isFunction (fn) {
      return fn && typeof fn === 'function'
    },
    executeFunc (args = [], msg, func = noop, noShowConfirm) {
      if (msg && !noShowConfirm) { // 给出提示
        this.$confirm(msg, (done) => {
          done()
          if (this.isFunction(func)) {
            func(...args, this.rowData)
          }
        })
        return
      }
      if (this.isFunction(func)) {
        func(...args, this.rowData)
      }
    },
    handleCommand (command) {
      const { args = [], clickCallBack, confirmMsg } = this.dropdownItemsFunc[command]
      this.executeFunc(args, confirmMsg, clickCallBack)
    }
  }
}
</script>

<style lang="scss">
.table-options-icon [disabled] {
    color: #c0c4cc;
    cursor: not-allowed !important;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
    filter: grayscale(1);
  *, *:hover, *:focus {
    color: #c0c4cc;
    cursor: not-allowed !important;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
    filter: grayscale(1);
  }
}
.table-options-icon [disabled]:hover, .table-options-icon [disabled]:focus {
    color: #c0c4cc;
    cursor: not-allowed !important;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
    filter: grayscale(1);
}
</style>
