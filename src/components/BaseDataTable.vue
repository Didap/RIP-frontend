<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
} from '@tabler/icons-vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const props = withDefaults(defineProps<{
  columns: ColumnDef<any, any>[]
  data: any[]
  loading?: boolean
  searchPlaceholder?: string
  searchKey?: string
  title?: string
  emptyMessage?: string
}>(), {
  loading: false,
  searchPlaceholder: 'Cerca...',
  searchKey: '',
  title: '',
  emptyMessage: 'Nessun risultato trovato.',
})

defineEmits<{
  (e: 'row-click', row: any): void
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const globalFilter = ref('')

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting.value)
      : updaterOrValue
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(columnFilters.value)
      : updaterOrValue
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(globalFilter.value)
      : updaterOrValue
  },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get globalFilter() { return globalFilter.value },
  },
})

const pageInfo = computed(() => ({
  current: table.getState().pagination.pageIndex + 1,
  total: table.getPageCount(),
}))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
      <div class="flex items-center gap-2">
        <div class="relative w-64">
          <IconSearch class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            :placeholder="searchPlaceholder"
            :model-value="globalFilter"
            class="pl-8"
            @update:model-value="(val) => globalFilter = String(val)"
          />
        </div>
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader class="bg-muted sticky top-0 z-10">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :col-span="header.colSpan"
              class="cursor-pointer select-none"
              @click="header.column.getCanSort() ? header.column.toggleSorting() : undefined"
            >
              <div class="flex items-center gap-1">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <template v-if="header.column.getIsSorted()">
                  <span v-if="header.column.getIsSorted() === 'asc'" class="text-xs">↑</span>
                  <span v-else class="text-xs">↓</span>
                </template>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Loading skeleton -->
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="'skeleton-' + i">
              <TableCell v-for="j in columns.length" :key="'skeleton-cell-' + j">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>
          <!-- Data rows -->
          <template v-else-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="cursor-pointer transition-colors hover:bg-muted/50"
              @click="$emit('row-click', row.original)"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <!-- Empty state -->
          <TableRow v-else>
            <TableCell :col-span="columns.length" class="h-24 text-center text-muted-foreground">
              {{ emptyMessage }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-2">
      <div class="text-muted-foreground text-sm">
        {{ table.getFilteredRowModel().rows.length }} risultati
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden items-center gap-2 lg:flex">
          <Label class="text-sm font-medium">Righe per pagina</Label>
          <Select
            :model-value="`${table.getState().pagination.pageSize}`"
            @update:model-value="(v) => v && table.setPageSize(Number(v))"
          >
            <SelectTrigger size="sm" class="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem v-for="size in [10, 20, 30, 50]" :key="size" :value="`${size}`">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-1 text-sm font-medium">
          Pagina {{ pageInfo.current }} di {{ pageInfo.total }}
        </div>
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="hidden size-8 lg:flex"
            :disabled="!table.getCanPreviousPage()"
            @click="table.setPageIndex(0)"
          >
            <IconChevronsLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            <IconChevronLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            <IconChevronRight class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="hidden size-8 lg:flex"
            :disabled="!table.getCanNextPage()"
            @click="table.setPageIndex(table.getPageCount() - 1)"
          >
            <IconChevronsRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
