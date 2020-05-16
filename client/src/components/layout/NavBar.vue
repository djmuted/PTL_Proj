<template>
<div class="container is-fluid">
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }" class="logo">
                LiveKOKOS
            </b-navbar-item>
        </template>
        
         <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-warning is-medium">
                        <strong>Skopiuj link do konferencji</strong>
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</div>
</template>

<style scoped>
    .logo {
        font-size: 2em;
    }
    .logo img {
        /* width: 48px !important; */
        height: 60px;
        margin-right: 12px;
        max-height: none;
    }
</style>