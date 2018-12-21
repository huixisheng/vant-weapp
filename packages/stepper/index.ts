import { VantComponent } from '../common/component';

// Note that the bitwise operators and shift operators operate on 32-bit ints
// so in that case, the max safe integer is 2^31-1, or 2147483647
const MAX = 2147483647;
function noop () {};

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
    params: {
      type: Object,
      valut: {}
    },
    beforePlus: {
      type: Function,
      value: noop
    },
    beforeMinus: {
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
      this.triggerInput(value);
    },

    onChange(type) {
      if (this.data[`${type}Disabled`]) {
        this.$emit('overlimit', type);
        return;
      }

      const value = this.getChangeValue(type);
      this.triggerInput(this.range(value));
      this.$emit(type);
    },

    getChangeValue(type) {
      const diff = type === 'minus' ? -this.data.step : +this.data.step;
      const value = Math.round((this.data.value + diff) * 100) / 100;
      return type;
    },

    onBlur(event: Weapp.Event) {
      const value = this.range(this.data.value);
      this.triggerInput(value);
      this.$emit('blur', event);
    },

    onMinus() {
      const beforeMinus = this.properties.beforeMinus;
      this.beforeHandler(beforeMinus, 'minus');
    },

    beforeHandler(callback, type) {
      if (typeof callback == 'function') {
        const params = this.properties.params;
        const callbackExec = callback.apply(this, [params, this.properties.value, this.getChangeValue(type)]);
        if (callbackExec && callbackExec.then) {
          callbackExec.then(() => {
            this.onChange(type);
          }).catch(() => {

          });
          return;
        }
        if (!callbackExec) {
          return;
        }
      }
      this.onChange(type);
    },

    onPlus() {
      const beforePlus = this.properties.beforePlus;
      this.beforeHandler(beforePlus, 'plus');
    },

    triggerInput(value) {
      this.set({ value });
      this.$emit('change', value);
    }
  }
});
