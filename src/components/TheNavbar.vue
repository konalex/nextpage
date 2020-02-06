<template>
  <!-- Стандартная навигация -->
  <nav>
      <ul class="container container__main">
          <li>
              <router-link to="/" class="button">
                Dashboard
              </router-link>
          </li>
          <li>
              <router-link to="/edit/" class="button">
                Create
              </router-link>
          </li>
      </ul>
  </nav>
</template>

<script>
export default {

}
</script>
<style lang="sass" scoped>
/* Навигация фиксированная, вдруг заметок будет много */
nav
    position: fixed
    left: 0
    top: 0
    
    width: 100%
    
    background-color: white
    ul
        display: flex
        justify-content: flex-start
        align-items: center

        list-style: none
        padding: 15px 20px
        li
            margin: 0 10px 0 0
</style>