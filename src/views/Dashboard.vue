<template>
    <!-- Если заметок нет, вообще не выводим весь блок -->
    <div class="dashboard container__main--content" v-if="notes.length">
        <!-- Список заметок -->
        <div class="note__list">
            <div class="note__list__head">
                <div class="note__list__head__item">Note title</div>
                <div class="note__list__head__item">Note tasks</div>
                <div class="note__list__head__item"></div>
            </div>
            <div class="note__list__body">
                <div
                    class="note__list__body__item note"
                    v-for="note in notes"
                    :key="note.id">

                    <div class="note__title">
                        {{ note.title }}
                    </div>

                    <div class="note__tasks">
                        <!-- Список задач как ненумерованный список. Выполненная\в работе, показываюся как разными символами, так и цветом -->
                        <ul>
                            <li
                                v-for="task in note.tasks.filter( (element, index) => index < 3)"
                                :key="task.id"
                                :class="{'done': task.status }"
                                class="note__tasks_item task">
                                {{ task.title }}
                            </li>
                        </ul>
                    </div>

                    <div class="note__actions">
                        <router-link tag="button" class="button" :to="'/edit/' + note.id">
                            Edit
                        </router-link>
                        <button
                            class="button button--error"
                            type="button"
                            @click.stop="sendToDeleteNote( note.id )">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            id: null
        }
    },
    props: {
        result: Boolean,
    },
    watch: {
        /* Отслеживаем результат от модалки */
        'result': {
            handler: function(value) {
                if( value ) this.deleteNote()
            }
        }
    },
    computed: {
        /* Список задач из store */
        notes() {
            return this.$store.getters.notes
        }
    },
    methods: {
        /* Запрашиваем подтверждение на удаление заметки */
        sendToDeleteNote( index ) {
            this.id = index
            this.$emit('confirm')
        },
        /* Удаляем заметку, после подверждения */
        deleteNote() {
            this.$store.dispatch('removeNote', this.id)
            this.$router.push('/')
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../sass/variables'
.note__list
    width: 100%
    &__head
        display: flex

        margin-bottom: 10px
        padding-bottom: 5px

        border-bottom: 2px solid rgba( #34495e, .1)
        &__item
            width: calc( (100% - 130px) / 2 )
            font-weight: bold
            font-size: 16px
            &:last-child
                width: 130px
    &__body
        display: flex
        flex-direction: column
        justify-content: flex-start
        align-items: flex-start
        .note
            display: flex
            width: 100%

            margin-bottom: 10px
            padding-bottom: 10px

            border-bottom: 1px solid rgba( #34495e, .2)
            &__title
                width: calc( (100% - 130px) / 2 )
            &__tasks
                width: calc( (100% - 130px) / 2 )
                ul
                    li
                        list-style: circle

                        white-space: nowrap
                        text-overflow: ellipsis
                        overflow: hidden
                        &.done
                            list-style: disc

                            color: $success
            &__actions
                width: 130px
                .button--error
                    margin-left: 5px
</style>