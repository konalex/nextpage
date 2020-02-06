<template>
    <div id="app">
        <div class="container container__main">
            <!-- Навигацию держим отдельно -->
            <Navbar></Navbar>
            <!-- Выводим контент без обертки -->
            <router-view
                @confirm="formOpen"
                :result="modalResult">

            </router-view>
            <!-- Такое разделение, нужно для возможности закрыть модалку кликнув вне её -->
            <div class="modal" v-if="modal">
                <div class="modal__wrapper" @click.self="formClose">
                    <Modal
                        @close="formClose"
                        @confirm="confirm">
                    </Modal>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Navbar from '@/components/TheNavbar';
import Modal from '@/components/TheModal';
export default {
    data() {
        return {
            modal: false, //Для показа модалки
            modalResult: null //Для результат от модалки
        }
    },
    components: {
        Navbar,
        Modal
    },
    methods: {
        /* Ловим результат от модалки */
        confirm() {
            this.modalResult = true
            this.formClose()
        },
        /* Открываем модалку, и очищаем переменную для результата */
        formOpen() {
            this.modalResult = null
            this.modal = true
        },
        /* Закрываем модалку, и очищаем переменную резальтата */
        formClose() {
            this.modal = false
            setTimeout( () => {
                this.modalResult = null /* Реактивность данных не позволяет отправить подверждение */
            }, 0)
        }
    },
    computed: {

    },
    mounted() {
        
    }
}
</script>

<style lang="sass">
@import './sass/variables'
@import './sass/animations' //Файлы не компилирутся, а только импортятся где нужно
// Default
*
  margin: 0
  padding: 0
  font-family: Roboto, sans-serif

// Grid
.container
    margin: 0 auto
    &__main
        width: 600px
        &--content
            margin-top: 60px
            padding: 10px
            box-shadow: 0 0 10px 0 rgba(0,0,0, .1)
.row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start

// Buttons
.button
    padding: 7px 15px
    text-decoration: none

    border: none
    border-radius: 5px

    background-color: $btn-color

    color: black
    font-size: 14px

    cursor: pointer

    transition: all 150ms
    &--success
        background-color: $success

        color: white
        &:hover
            background-color: darken( $success, 10%) !important
    &--error
        background-color: $error

        color: white
        &:hover
            background-color: darken( $error, 10%) !important
    &:hover
        background: darken( $btn-color, 10%)

//Inputs

input[type="text"]
    padding: 5px 10px
    border-radius: 5px
    border: 1px solid $btn-color
    &.success
        border-color: $success
    &.error
        border-color: $error
input[type="checkbox"]
    width: 1px
    height: 1px
    opacity: 0
    & ~ span
        margin-left: 7px
        &:before
            content: ''

            display: block

            width: 15px
            height: 15px

            background-color: $btn-color
            
            border-radius: 15px

            transition: 150ms
    &:checked ~ span:before
        background-color: $success

// Modal
.modal
    &__wrapper
        position: fixed
        top: 0
        left: 0

        display: flex
        justify-content: center
        align-items: center

        width: 100vw
        height: 100vh

        background-color: rgba( 0, 0, 0, .6) //Фон слегка прозрачный
</style>
