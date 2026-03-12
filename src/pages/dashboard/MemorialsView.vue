<script setup lang="ts">
import DataTable from "../../components/DataTable.vue"

const data = [
  {
    id: 1,
    header: "Mario Rossi",
    type: "Memoriale",
    status: "Done",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Anna Bianchi",
    type: "Memoriale",
    status: "In Process",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Giuseppe Verdi",
    type: "Memoriale",
    status: "Done",
    target: "10",
    limit: "13",
    reviewer: "Assign reviewer",
  },
]
</script>

<template>
  <DataTable :data="data" />
</template>
