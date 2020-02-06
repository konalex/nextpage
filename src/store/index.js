import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        notes: JSON.parse( localStorage.getItem('notes') || '[]' )
    },

    mutations: {
        /* Добавляем заметку в массив */
        addNote( state, note ) {
            state.notes.push( note );

            localStorage.setItem('notes', JSON.stringify( state.notes )); 
            /*
                Чтобы данные не исчезали при перезагрузке страницы, ложим их в localstorage.
                Можно и sessionStorage, особой разницы в данном случае нет
            */
        },

        /* Сохраняем измененную заметку */
        saveNote(state, {id, title, tasks}) {
            const notes = state.notes.concat()

            const index = notes.findIndex(element => element.id === id)
            const note = notes[index]

            notes[index] = {...note, title, tasks} //Объединяем, для сохранения 
            state.notes = notes

            localStorage.setItem('notes', JSON.stringify(state.notes))
        },

        /* Удаяем заметку по индексу */
        deleteNote( state, id) {
            const index = state.notes.findIndex(element => element.id === id);
            state.notes.splice( index, 1 )

            localStorage.setItem('notes', JSON.stringify(state.notes))
        }
    },

    actions: {
        createNote({commit}, note) {
            commit('addNote', note);
        },
        updateNote({commit}, note) {
            commit('saveNote', note);
        },
        removeNote({commit}, id) {
            commit('deleteNote', id)
        }
    },

    getters: {
        /* Геттеры простые, сокращение синтаксиса не критично */
        notes: state => state.notes,
        noteById: state => index => state.notes.find( note => note.id === index )
    }
})
