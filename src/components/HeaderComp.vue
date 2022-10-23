<template>
  <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" label="Page One" />
        <q-route-tab to="/payment" label="Page Two" />
        <q-route-tab to="/user" label="Page Three" />
      </q-tabs>
    </q-header>
</template>

