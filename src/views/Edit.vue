<template>
    <div class="container container__main--content">
        <h2>{{ noteAction }} note</h2>
        <form @submit.stop.prevent="submitEditForm" class="form">
            <div class="container">
                <label class="input input--column form__title">
                    <h3>Note title</h3>
                    <!-- При событие изменения заголовка - пишем его в массив со всем изменениями -->
                    <input
                        type="text"
                        :value="this.temp.data[this.temp.step].title"
                        @change="[buffer.title = $event.target.value, saveChanges( buffer )]"
                        placeholder="Note title"
                        ref="title">
                </label>
                <div class="todo">
                    <div class="todo__list">
                        <p class="todo__list__title">Tasks</p>
                        <div v-if="this.temp.data[this.temp.step].tasks.length">
                            <transition-group name="task">
                                <div
                                    v-for="(task, index) in this.temp.data[this.temp.step].tasks"
                                    :key="task.id"
                                    class="row todo__list__item task-item">
                                    <label
                                        class="input input--row todo__list__item__input"
                                        :class="{'todo__list__item__input--done' : task.status }">
                                        <!-- При событие изменения заголовка - пишем его в массив со всем изменениями -->
                                        <input
                                            type="text"
                                            placeholder="Task title"
                                            :value="task.title"
                                            @change="[buffer.tasks[index].title = $event.target.value, saveChanges( buffer )]"
                                            ref="taskTitle">
                                    </label>
                                    <label class="input input--row input--row--centered todo__list__item__status">
                                        <!-- При событие изменения статуса - пишем его в массив со всем изменениями -->
                                        <input
                                            type="checkbox"
                                            :class="{ 'done': task.status }"
                                            v-model="task.status"
                                            @click="changeTaskStatus( task.id )">
                                        <span class="row"></span>
                                    </label>
                                    <button
                                        @click.stop="removeTask( task.id )"
                                        class="button todo__list__item__remove"
                                        type="button">
                                    </button>
                                </div>
                            </transition-group>
                        </div>
                        <div v-else>
                            <span class="todo__list__tooltip">Task required</span>
                        </div>
                        <div class="todo__list__actions">
                            <button
                                class="button todo__list__actions__button"
                                type="button"
                                @click.stop="addTask">Add task</button>
                            <!-- Кнопка появится, если есть "шаги" для изменений -->
                            <button
                                class="button todo__list__actions__button"
                                type="button"
                                v-if="this.$route.params.id && this.temp.step !== 0"
                                @click.prevent="discardNoteChange"
                                >Discard</button>
                            <!--
                                Кнопка появится, если "шаг" изменений не последний.
                                Т.е. если хоть раз была нажата кнопка отмены измнений
                            -->
                            <button
                                class="button todo__list__actions__button"
                                type="button"
                                v-if="this.$route.params.id && this.temp.step !== this.temp.data.length - 1"
                                @click.prevent="applyNoteChange"
                                >Apply</button>
                        </div>
                    </div>
                </div>
                <div class="form__footer">
                    <button
                        class="button button--success"
                        type="submit">Save</button>
                    <button
                        class="button button--error"
                        type="button"
                        @click.prevent="noteCancel">Cancel</button>
                    <!-- Кнопка появится, если есть индекс заметки -->
                    <button
                        class="button button--error"
                        type="button"
                        v-if="this.$route.params.id"
                        @click.prevent="noteSendToRemove"
                        >Delete note</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            buffer: {},
            temp: {
                step: 0,
                data: []
            },
            action: null,
            changes: 0 
        }
    },
    props: {
        result: Boolean
    },
    watch: {
        /* Для подтверждений от модального окна */
        'result': {
            handler: function( value ) {
                if( this.action == 'remove' ) {
                    this.removeNote()
                }
                else this.exit()
            }
        },
        /* Убираем возникающий баг из-за роутера */
        'note': {
            handler: function( value ) {
                this.temp.data[this.temp.step] = JSON.parse( JSON.stringify( this.note ) ) /* Копируем объект */
                this.buffer = JSON.parse( JSON.stringify( this.note ) ) /* Копируем объект */
            },
        }
    },
    methods: {
        /* Валидируем форму и отправляем данные в store */
        submitEditForm() {
            if( this.formValidate() ) {
                const data = {
                    id: new Date().getTime(),
                    title: this.buffer.title,
                    tasks: this.buffer.tasks
                };
                if( +this.$route.params.id ) {
                    data.id = +this.$route.params.id
                    this.$store.dispatch('updateNote', data)
                }
                else {
                    this.$store.dispatch('createNote', data)
                    this.$router.push({name: 'edit', params: {id: data.id} }) /* Переходим в редактировние этой заметки */
                }
                this.action = 'cancel' /* Статус для выхода из страницы */
            }
        },
        /* Добавляем Todo в список */
        addTask() {
            let task = {id: new Date().getTime(), title: '', status: false} /* Число даты в милисекундах - отличный уникальный ID */
            this.buffer.tasks.push( task )
            this.saveChanges( this.buffer )
        },
        /*
            Валидация формы.
            Вернет Boolean значение
        */
        formValidate() {
            let title = !!this.buffer.title;
            this.setStatusToInput( this.$refs.title, title) /* Подсветим input с заголовком заметки */

            let tasks = false;
            if( this.buffer.tasks.length > 0 ) {
                this.buffer.tasks.forEach( (element, index) => {
                    this.setStatusToInput( this.$refs.taskTitle[index], !!element.title) /* Подветим input-ы с заголовоками задач */
                })
                /* Проверям, столько же задач с заголовком, сколько в списке */
                tasks = this.buffer.tasks.filter( element => !!element.title).length === this.buffer.tasks.length 
            }
            return title && tasks;
        },
        /* При валидации, подсвечиваем какие input-ы заполнены, а какие - нет */
        setStatusToInput( input, status ) {
            input.classList = status? 'success' : 'error' /* Ставим статус, для понимая, что заполнить, а что не надо */
        },
        /* Уходим из "страницы" */
        exit() {
            this.action = null
            this.$router.push('/')
        },
        /*
            При нажатии на кнопку отмены редактирования,
            ставим статус, для чего нужно подтверждение,
            и emit-им в родителя, для ответа от модалки
        */
        noteCancel() {
            this.action = 'cancel'
            this.$emit('confirm')
        },
        /* Сохранение изменений в массив, где каждое изменение - новый объект */
        saveChanges( value ) {
            if( !value ) {
                this.buffer = value = JSON.parse( JSON.stringify( this.temp.data[this.temp.step]) )
            }
            let count = this.temp.data.length - this.temp.step
            if( this.temp.step < this.temp.data.length - 1) {
                this.temp.data.splice(this.temp.step + 1, count );
            }
            this.temp.step++
            this.temp.data[this.temp.step] = JSON.parse( JSON.stringify( value ) )
        },
        /*
            При отмене изменений, в массиве с объектами,
            переходит на предыдущий объект
        */
        discardNoteChange() {
            this.temp.step--
            this.buffer = JSON.parse( JSON.stringify( this.temp.data[this.temp.step] ) )
        },
        /*
            При повторении изменений, в массиве с объектами,
            переходит на следующий объект
        */
        applyNoteChange() {
            this.temp.step++
            this.buffer = JSON.parse( JSON.stringify( this.temp.data[this.temp.step] ) )
        },
        /*
            При нажатии на кнопку удаления заметки,
            ставим статус, для чего нужно подтверждение,
            и emit-им в родителя, для ответа от модалки
        */
        noteSendToRemove() {
            this.action = 'remove'
            this.$emit('confirm')
        },
        /* Когда приходит подтверждение, в store вызываем action */
        removeNote() {
            this.$store.dispatch('removeNote', this.id)
            this.exit()
        },
        /* Ищем задачи по их индексу, и удаляем из массива */
        removeTask( index ) {
            let id = this.buffer.tasks.findIndex( element => element.id === index )
            this.buffer.tasks.splice( id, 1 )
            this.saveChanges( this.buffer )
        },
        /*
            Ищем задачу по индексу,
            меняем её статус на противолопожный
            и пишем данные в массив с изменениями
        */
        changeTaskStatus( index ) {
            let id = this.buffer.tasks.findIndex( element => element.id === index )
            let task = this.buffer.tasks[id]
            task.status = !task.status
            this.buffer.tasks.splice( id, 1, task )
            this.saveChanges( this.buffer )
        }
    },
    computed: {
        /*
            Подбираем заголовок формы, в зависимости от наличия индекса задачи
        */
        noteAction() {
            return +this.$route.params.id? 'Edit' : 'Create new';
        },
        /*
            Забираем из store заметку по её индексу,
            или создаем пустую
        */
        note() {
            if( +this.$route.params.id ) {
                return this.$store.getters.noteById(+this.$route.params.id)
            }
            else {
                return {
                    id: 0,
                    title: '',
                    tasks: [],
                };
            }
        }
    },
    created() {
        /* При создании компонента, копируем объекты, для последующей работы */
        this.temp.data[this.temp.step] = JSON.parse( JSON.stringify( this.note ) )
        this.buffer = JSON.parse( JSON.stringify( this.note ) )
    },
    mounted() {
        /* Сразу ставим статус для выхода из "страницы" */
        this.action = 'cancel'
    },
    /*
        При выходе из страницы, запрашваем подтверждение
        Поведение аналогично нажатию на кнопку отмены редактировния
    */
    beforeRouteLeave( to, from, next ) {
        if( !this.action ) {
            next()
        }
        else {
           this.noteCancel()
        }
    }

}
</script>

<style lang="sass" scoped>
@import '../sass/variables' //Забираем цвета

.form
    &__title
        margin: 40px 0
    .todo__list
        display: inline-flex
        flex-direction: column
        justify-content: flex-start
        align-items: flex-start
        &__title
            margin-bottom: 20px
        &__actions
            margin-top: 20px
            &__button
                margin-right: 10px
        &__item
            position: relative

            margin: 5px 0
            &__input
                /* Стиль для input у задачи, которая помечена выполненной */
                &--done
                    position: relative
                    &:before
                        content: ''
                        width: 90%
                        height: 1px

                        position: absolute
                        left: 5%
                        top: 50%
                        
                        background-color: darken( $btn-color, 20% )
                    input
                        background-color: $btn-color
            &__status
                height: 28px
            &__remove
                position: absolute
                right: -25px
                top: 3px
                
                display: flex
                justify-content: center
                align-items: center

                padding: 10px
                &:before, &:after
                    content: ''

                    position: absolute

                    width: 10px
                    height: 1px
                    
                    background-color: $error
                &:before
                    transform: rotate(-45deg)
                &:after
                    transform: rotate(45deg)
        &__tooltip
            font-size: 12px

            color: #7f8c8d
    label.input
        display: flex

        justify-content: flex-start
        align-items: flex-start
        &--row
            flex-direction: row
            &--centered
                align-items: center
        &--column
            flex-direction: column
        span
            font-size: 12px
    .form__footer
        margin: 20px 0 0 0
        .button
            margin: 0 10px 0 0
</style>