<template>
	<div>
		<div class="page-title">
			<h3>История записей</h3>
		</div>

		<Loader v-if="loading" />

		<p class="center" v-else-if="!records.length">
			Записей пока нет
			<router-link to="/record">Добавьте первую</router-link>
		</p>

		<section v-else>
			<div class="row">
				<div class="history-chart col s6">
					<pie-out-chart
						:chartdata="chartOutcomeData"
						:options="chartOptions"
					/>
				</div>
				<div class="history-chart col s6">
					<pie-in-chart :chartdata="chartIncomeData" :options="chartOptions" />
				</div>
			</div>

			<HistoryTable :records="items" />
			<Paginate
				v-model="page"
				:page-count="pageCount"
				:click-handler="pageChangeHandler"
				:prev-text="'Назад'"
				:next-text="'Вперед'"
				:container-class="'pagination'"
				:page-class="'waves-effect'"
			/>
		</section>
	</div>
</template>

<script>
import paginationMixin from "@/mixins/pagination.mixin"
import HistoryTable from "@/components/HistoryTable"
import Loader from "@/components/app/Loader.vue"
import PieInChart from "@/components/Chart.js"
import PieOutChart from "@/components/Chart.js"

export default {
	name: "history",
	mixins: [paginationMixin],
	data: () => ({
		loading: true,
		records: [],
		chartOutcomeData: null,
		chartIncomeData: null,
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
		},
	}),
	async mounted() {
		this.records = await this.$store.dispatch("fetchRecords")
		const categories = await this.$store.dispatch("fetchCategories")

		this.setup(categories)

		this.loading = false
	},
	methods: {
		setup(categories) {
			this.setupPagination(
				this.records.map((record) => {
					return {
						...record,
						categoryName: categories.find((c) => c.id === record.categoryId)
							.title,
						typeClass: record.type === "income" ? "green" : "red",
						typeText: record.type === "income" ? "Доход" : "Расход",
					}
				}),
			)

			this.chartOutcomeData = {
				labels: categories.map((c) => c.title),
				datasets: [
					{
						label: "Расходы по категориям",
						data: categories.map((c) => {
							return this.records.reduce((total, r) => {
								if (r.categoryId === c.id && r.type === "outcome") {
									total += +r.amount
								}
								return total
							}, 0)
						}),
						backgroundColor: [
							"rgba(255, 99, 132, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							"rgba(255, 206, 86, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(153, 102, 255, 0.2)",
							"rgba(255, 159, 64, 0.2)",
						],
						borderColor: [
							"rgba(255, 99, 132, 1)",
							"rgba(54, 162, 235, 1)",
							"rgba(255, 206, 86, 1)",
							"rgba(75, 192, 192, 1)",
							"rgba(153, 102, 255, 1)",
							"rgba(255, 159, 64, 1)",
						],
						borderWidth: 1,
					},
				],
			}

			this.chartIncomeData = {
				labels: categories.map((c) => c.title),
				datasets: [
					{
						label: "Доходы по категориям",
						data: categories.map((c) => {
							return this.records.reduce((total, r) => {
								if (r.categoryId === c.id && r.type === "income") {
									total += +r.amount
								}
								return total
							}, 0)
						}),
						backgroundColor: [
							"rgba(255, 99, 132, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							"rgba(255, 206, 86, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(153, 102, 255, 0.2)",
							"rgba(255, 159, 64, 0.2)",
						],
						borderColor: [
							"rgba(255, 99, 132, 1)",
							"rgba(54, 162, 235, 1)",
							"rgba(255, 206, 86, 1)",
							"rgba(75, 192, 192, 1)",
							"rgba(153, 102, 255, 1)",
							"rgba(255, 159, 64, 1)",
						],
						borderWidth: 1,
					},
				],
			}
		},
	},
	components: {
		HistoryTable,
		PieInChart,
		PieOutChart,
	},
}
</script>
