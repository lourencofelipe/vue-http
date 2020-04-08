<template>
    <div>

        <div class="row">
            <div class="col-sm-10">
                <h1 class="font-weight-light">Lista de Tarefas</h1>
            </div>
            <div class="col-sm-2">
                <button class="btn btn-primary float-right" @click="exibirFormularioCriarTarefa">
                    <i class="fa fa-plus mr-2"></i>
                    <span>Criar</span>
                </button>
            </div>
        </div>

        <ul class="list-group" v-if="tarefas.length > 0">
            <TarefasListaIten
                v-for="tarefa in tarefas"
                :key="tarefa.id"
                :tarefa="tarefa"
                @editar="selecionarTarefaParaEdicao"
                @deletar="deletarTarefa"
                @concluir="editarTarefa" />
        </ul>

        <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

        <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

        <TarefaSalvar v-if="exibirFormulario"
            :tarefa="tarefaSelecionada"
            @criar="criarTarefa"
            @editar="editarTarefa" />

    </div>
</template>

<script>

import axios from './../axios'
import TarefaSalvar from './TarefaSalvar.vue'
import TarefasListaIten from './TarefasListaIten.vue'

export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        }
    },
    created() {
        // Chamada get da API.
        axios.get(`/tarefas`)
        .then((response) => {
            this.tarefas = response.data
        }, error => {
            return Promise.reject(error)
        }).catch(error => {
            console.log('Erro capturado no catch: ', error)
            if(error.response){
                this.mensagemErro = `Servidor retornou um erro: ${error.message} ${error.response.statusText}`
            } else if(error.request){
                this.mensagem = `Erro ao tentar comunicar com o servidor: ${error.message}`            
            } else {
                this.mensagemErro = `Erro ao fazer requisição ao servidor: ${error.message}`
            }
        })
    },
    methods: {
        criarTarefa(tarefa) {
            // Requisição post com axios.
            // axios.post(`${}/tarefas`, tarefa)
            //     .then((response) => {
            //         // Adicionando tarefa a lista local.
            //         this.tarefas.push(response.data)
            //         // Ocultando o componente
            //         this.resetar()
            //     })
            axios.request({
                method: 'post',
                url: `/tarefas`,
                data: tarefa
            }).then((response) => {
                    // Adicionando tarefa a lista local.
                    this.tarefas.push(response.data)
                    // Ocultando o componente
                    this.resetar()
                })
        },
        selecionarTarefaParaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa
            this.exibirFormulario = true
        },
        editarTarefa(tarefa) {
            axios.put(`/tarefas/${tarefa.id}`, tarefa)
            .then(() => {
                const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                this.tarefas.splice(indice, 1, tarefa)
                this.resetar()
            })
        },
        async deletarTarefa(tarefa) {
            const confirmar = window.confirm(`Deseja deletar a tarefa com título "${tarefa.titulo}" ?`)
            if(confirmar) {
                // axios.delete(`/tarefas/${tarefa.id}`)
                //     .then(() => {
                //         const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                //         this.tarefas.splice(indice, 1)
                //     })
                try{
                    const response = await axios.delete(`/tarefas/${tarefa.id}`)
                    const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                    this.tarefas.splice(indice, 1)
                } catch (error) {
                    console.log('Erro ao excluir tarefa: ' error)
                }
            }
        },
        resetar() {
            this.tarefaSelecionada = undefined
            this.exibirFormulario = false
        },
        exibirFormularioCriarTarefa() {
            if(this.tarefaSelecionada){
                this.tarefaSelecionada = undefined
                return
            }
            this.exibirFormulario = !this.exibirFormulario
        }
    }
}
</script>
