class RecintosZoo {
    constructor() {
        //Descrição de cada recinto
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, ocupados: 3, animais: ['macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, ocupados: 0, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, ocupados: 2, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, ocupados: 0, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, ocupados: 1, animais: ['leão'] }
        ];
        //Descriçao de cada animal com suas caracteristicas do desafio
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(especie, quantidade) {

        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas, carnivoro } = this.animais[especie];
        const espacoNecessario = tamanho * quantidade;

        // Verifica cada recinto
        const recintosViaveis = this.recintos
            .filter(recinto => {
                //Calcula o espaco disponivel
                const espacoLivre = recinto.tamanho - recinto.ocupados;
                //verifica se o bioma faz sentido para aquele animal
                const biomaAdequado = biomas.includes(recinto.bioma.split(' e ')[0]) || biomas.includes(recinto.bioma.split(' e ')[1]);
                //Verifica se o animal pode dividir o espaco com outro
                const podeDividir = !carnivoro || (recinto.animais.length === 0 || recinto.animais.includes(especie));

                // Regra do macacos, precisa haver outro animal ou mais de 1 macaco
                const macacoOk = especie !== 'MACACO' || (recinto.animais.length > 0 || quantidade > 1);
                // regra do hipopotamo para
                const hipopotamoOk = especie !== 'HIPOPOTAMO' || recinto.bioma === 'savana e rio';

                // Verifica se já existem animais da mesma espécie para não aplicar espaço extra
                const espacoComOutroAnimal = (recinto.animais.length > 0 && !recinto.animais.includes(especie)) ? espacoNecessario + 1 : espacoNecessario;

                return biomaAdequado && espacoLivre >= espacoComOutroAnimal && podeDividir && macacoOk && hipopotamoOk;
            })
            .map(recinto => {
                // Espaço extra só é aplicado para múltiplas espécies
                const espacoExtra = (recinto.animais.length > 0 && !recinto.animais.includes(especie)) ? 1 : 0;
                const espacoLivre = recinto.tamanho - (recinto.ocupados + espacoNecessario + espacoExtra);
                return { numero: recinto.numero, texto: `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})` };
            })
            .sort((a, b) => a.numero - b.numero); // Ordenar os recintos pelo número

        if (recintosViaveis.length > 0) {
            return { recintosViaveis: recintosViaveis.map(r => r.texto) };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}export { RecintosZoo as RecintosZoo };
