<template>
  <w-dialog
    :show.sync="show"
    @closeDialog="closeDialog"
    :buttons="buttons"
    :height="height"
    :width="width"
    :title="$t(title)"
  >
    <div class="showText">
      {{ showText }}
    </div>
    <el-form
      :model="formModel"
      size="mini"
      class="form"
      label-width="70px"
      ref="form"
      @submit.native.prevent
    >
      <el-form-item :label="$t('login.enter_code')" prop="code" ref="code" :rules="[{ required: true, message: $t('msg.required'), trigger: ['blur', 'change']}]">
        <el-row class="login-code-new">
          <el-col :span="15">
            <el-input
              ref="code"
              v-model="formModel.code"
              :placeholder="$t('login.enter_code')"
              prefix-icon="login-password-icon"
              maxlength="4"
              @keyup.native.enter="confirm"
            ></el-input>
          </el-col>
          <el-col :span="9" style="height: 30px;">
            <w-check-code @getCode="getCode" ref="checkCode" v-bind="$attrs" v-on="$listeners" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </w-dialog>
</template>

<script>
export default {
  name: 'CheckCodeText',
  props: {
    title: {
      type: String,
      default: 'common.show_check_code_title'
    },
    showText: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: '300px'
    },
    resPro: {
      type: Function,
      default: function () {
        return true
      }
    }
  },
  data () {
    return {
      show: false,
      formModel: {
        code: ''
      },
      buttons: [
        {
          name: this.$t('button.confirm'),
          class: 'primary',
          func: this.confirm
        },
        {
          name: this.$t('button.cancel'),
          func: this.closeDialog
        }
      ]
    }
  },
  methods: {
    getCode (code) {
      this.checkCode = code
    },
    // 确认
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const text = this.formModel.code.toLowerCase()
          if (text === this.checkCode) {
            this.closeDialog()
            this.resPro()
            this.$emit('confirm')
          } else {
            this.formModel.code = ''
            this.$refs.checkCode.refresh()
            this.$alert(this.$t('alert.check_code_error'))
          }
        }
      })
    },
    showDialog () {
      this.show = true
      this.formModel.code = ''
      this.$nextTick(() => {
        // this.formModel.code = ''
        this.$refs.checkCode.refresh()
      })
    },
    closeDialog () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .showText{
    color: red;
    text-align: left;
    padding-bottom: 10px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 1.4;
  }
</style>
