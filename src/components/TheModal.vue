<template>
    <!-- Делим модалку на составные части -->
    <div class="modal__body">
        <div class="modal__body__title">Confirm action?</div>
        <div class="modal__body__content">
            <button
                @click="confirm"
                class="button button--success"
                type="button">Confirm</button>
            <button
                @click="close"
                class="button button--error"
                type="button">Cancel</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        /* Так как модалка только для подтверждения, можно пользоватся таким методом */
        confirm() {
            this.$emit('confirm');
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../sass/variables'
.modal__body
    padding: 20px

    border-radius: 5px

    background-color: white
    &__title
        font-size: 18px
    &__content
        margin-top: 30px
        .button--success
            margin-right: 20px
</style>