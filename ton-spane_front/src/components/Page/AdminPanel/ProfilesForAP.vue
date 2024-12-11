<template>
    <div class="container">
        <div class="left">
            <!-- Контент лівої частини -->
            Ліва частина
        </div>
        <div class="right">
            <!-- Контент правої частини -->
            Права частина
        </div>
    </div>
</template>


<style>
.container {
    display: flex;
    /* Використовуємо Flexbox */
    width: 100%;
    /* Контейнер займає всю ширину */
}

.left {
    width: 40%;
    /* Ліва частина займає 40% */
    background-color: lightgray;
    /* Трохи для візуалізації */
}

.right {
    width: 60%;
    /* Права частина займає 60% */
    background-color: lightblue;
    /* Трохи для візуалізації */
}
</style>