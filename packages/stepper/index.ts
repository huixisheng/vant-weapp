import { VantComponent } from '../common/component';

// Note that the bitwise operators and shift operators operate on 32-bit ints
// so in that case, the max safe integer is 2^31-1, or 2147483647
const MAX = 2147483647;
function noop () {}

VantComponent({
  field: true,

  classes: [
    'input-class',
    'plus-class',
    'minus-class'
  ],

  props: {
    value: Number,
    integer: Boolean,
    disabled: Boolean,
    disableInput: Boolean,
    before: {
      type: Function,
      value: noop
    },
    min: {
      type: null,
      value: 1
    },
    max: {
      type: null,
      value: MAX
    },
    step: {
      type: null,
      value: 1
    }
  },

  computed: {
    minusDisabled() {
      return this.data.disabled || this.data.value <= this.data.min;
    },

    plusDisabled() {
      return this.data.disabled || this.data.value >= this.data.max;
    }
  },

  watch: {
    value(value) {
      this.set({
        value: this.range(value)
      });
    }
  },

  data: {
    focus: false
  },

  created() {
    this.set({
      value: this.range(this.data.value)
    });
  },

  methods: {
    onFocus() {
      this.setData({
        focus: true
      });
    },

    // limit value range
    range(value) {
      return Math.max(Math.min(this.data.max, value), this.data.min);
    },

    onInput(event: Weapp.Event) {
      const { value = '' } = event.detail || {};
      this.triggerInput(value, 'input');
    },

    onChange(type) {
      if (this.data[`${type}Disabled`]) {
        this.$emit('overlimit', type);
        return;
      }

      const diff = type === 'minus' ? -this.data.step : +this.data.step;
      const value = Math.round((this.data.value + diff) * 100) / 100;
      this.triggerInput(this.range(value), type);
    },

    onBlur(event: Weapp.Event) {
      const value = this.range(this.data.value);
      this.triggerInput(value, 'blur');
    },

    onMinus() {
      this.onChange('minus');
    },

    onPlus() {
      this.onChange('plus');
    },

    triggerInput(value, type) {
      const before = this.properties.before;
      const beforeValue = this.properties.value;
      const that = this;

      if (typeof before == 'function') {
        const beforeExec = before.apply(this,  [value,  beforeValue, type]);
        if (beforeExec && beforeExec.then) {
          beforeExec.then(function () {
            that.set({ value });
            that.$emit('change', value, beforeValue);
            if (type) {
              that.$emit(type, value, beforeValue);
            }
          }).catch(() => {

          });
          return;
        }

        if (!beforeExec) {
          return;
        }
      }
      this.set({ value });
      if (type) {
        this.$emit(type, value, beforeValue);
      }
      this.$emit('change', value, beforeValue);
    }
  }
});
