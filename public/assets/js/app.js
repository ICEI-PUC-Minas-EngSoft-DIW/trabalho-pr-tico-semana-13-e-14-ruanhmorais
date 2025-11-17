// URL base da API
const API_URL = '/carreira';

// Carrega destaques do carrossel
async function carregarDestaques() {
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    
    if (!carouselIndicators || !carouselInner) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const dados = await response.json();

        const itensDestaque = dados.filter(item => item.destaque === true);
        
        carouselIndicators.innerHTML = '';
        carouselInner.innerHTML = '';

        itensDestaque.forEach((item, index) => {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#carouselDestaques');
            indicator.setAttribute('data-bs-slide-to', index);
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
            }
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);

            const slide = document.createElement('div');
            slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <img src="${item.imagem}" class="d-block w-100" alt="${item.titulo}" style="height: 500px; object-fit: cover;">
                <div class="carousel-caption d-none d-md-block">
                    <h2>${item.titulo}</h2>
                    <p>${item.descricao}</p>
                    <a href="detalhes.html?id=${item.id}" class="btn btn-warning btn-lg">Ver Detalhes</a>
                </div>
            `;
            carouselInner.appendChild(slide);
        });
    } catch (error) {
        console.error("Erro ao carregar destaques:", error);
        carouselInner.innerHTML = `<div class="alert alert-danger">Falha ao carregar destaques. Verifique se o servidor está rodando.</div>`;
    }
}


// Carrega cards da página inicial
async function carregarCards() {
    const containerClubes = document.getElementById('cards-clubes');
    const containerRecordes = document.getElementById('cards-recordes');
    
    if (!containerClubes || !containerRecordes) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const dados = await response.json();
        
        containerClubes.innerHTML = '';
        containerRecordes.innerHTML = '';
        
        // IDs 1-4: Clubes
        const clubes = dados.slice(0, 4);
        clubes.forEach(item => {
            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-3';
            card.innerHTML = `
                <article class="career-card h-100 d-flex flex-column">
                    <div onclick="irParaDetalhes(${item.id})" style="cursor: pointer; flex-grow: 1;">
                        <img src="${item.imagem}" alt="${item.titulo}">
                        <h3>${item.titulo}</h3>
                        <p>${item.descricao}</p>
                    </div>
                    <div class="p-3 d-flex gap-2">
                        <a href="editar_carreira.html?id=${item.id}" class="btn btn-secondary btn-sm w-100">Editar</a>
                        <a href="#" onclick="excluirItem(${item.id})" class="btn btn-danger btn-sm w-100">Excluir</a>
                    </div>
                </article>
            `;
            containerClubes.appendChild(card);
        });
        
        // IDs 5-7: Recordes
        const recordes = dados.slice(4);
        recordes.forEach(item => {
            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';
            card.innerHTML = `
                <article class="career-card h-100 d-flex flex-column">
                    <div onclick="irParaDetalhes(${item.id})" style="cursor: pointer; flex-grow: 1;">
                        <img src="${item.imagem}" alt="${item.titulo}">
                        <h3>${item.titulo}</h3>
                        <p>${item.descricao}</p>
                    </div>
                    <div class="p-3 d-flex gap-2">
                        <a href="editar_carreira.html?id=${item.id}" class="btn btn-secondary btn-sm w-100">Editar</a>
                        <a href="#" onclick="excluirItem(${item.id})" class="btn btn-danger btn-sm w-100">Excluir</a>
                    </div>
                </article>
            `;
            containerRecordes.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar cards:", error);
        containerClubes.innerHTML = `<div class="alert alert-danger">Falha ao carregar cards.</div>`;
    }
}

// Navega para a página de detalhes
function irParaDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

// Carrega detalhes do item
async function carregarDetalhes() {
    const detalhesContent = document.getElementById('detalhes-content');
    if (!detalhesContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    if (!id) {
        detalhesContent.innerHTML = `<div class="alert alert-danger">ID não fornecido.</div>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Item não encontrado');
        const item = await response.json();
        
        document.title = `${item.titulo} - CR7: A Lenda`;
        
        let momentosHtml = '';
        if (item.momentos_iconicos && item.momentos_iconicos.length > 0) {
            item.momentos_iconicos.forEach(momento => {
                momentosHtml += `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card bg-dark text-white h-100 border-secondary">
                            <img src="${momento.imagem}" class="card-img-top" alt="${momento.nome}" style="height: 220px; object-fit: cover;">
                            <div class="card-body" style="background-color: #1c1c1c;">
                                <h5 class="card-title">${momento.nome}</h5>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        detalhesContent.innerHTML = `
            <div class="container py-5">
                <div class="row">
                    <div class="col-12">
                        <a href="index.html" class="btn btn-secondary mb-4">← Voltar</a>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-5 mb-4">
                        <img src="${item.imagem}" alt="${item.titulo}" class="img-fluid rounded">
                    </div>
                    <div class="col-lg-7">
                        <span class="badge bg-warning text-dark mb-3" style="font-size: 0.9rem;">${item.categoria}</span>
                        <h1 class="mb-2">${item.titulo}</h1>
                        <p class="lead text-muted mb-4">${item.descricao}</p>
                        
                        <div class="mb-4">
                            <h5 class="mb-3">Informações</h5>
                            <p><strong>Período:</strong> <span style="font-size: 1.05rem;">${item.periodo}</span></p>
                            <p><strong>Títulos:</strong> <span style="font-size: 1.05rem;">${item.titulos}</span></p>
                            <p><strong>Gols:</strong> <span style="font-size: 1.05rem;">${item.gols}</span></p>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-5">
                    <div class="col-12">
                        <h3 class="mb-4">Detalhes Completos</h3>
                        <p style="font-size: 1.15rem; line-height: 1.9; text-align: justify; color: #ddd;">${item.conteudo}</p>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-12">
                        <h2 class="mb-4 section-title" style="text-align: left;">Momentos Icônicos</h2>
                    </div>
                    ${momentosHtml} 
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        detalhesContent.innerHTML = `<div class="container py-5"><div class="alert alert-danger"><h3>Item não encontrado!</h3><p>O item com ID ${id} não existe ou o servidor está offline.</p><a href="index.html" class="btn btn-primary">Voltar</a></div></div>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('detalhes-content')) {
        // Página detalhes.html
        carregarDetalhes();
    } else if (document.getElementById('carousel-inner')) {
        // Página index.html
        carregarDestaques();
        carregarCards();
    } else if (document.getElementById('cadastro-form')) {
        // Página cadastro_carreira.html
        document.getElementById('cadastro-form').addEventListener('submit', cadastrarItem);
    } else if (document.getElementById('editar-form')) {
        // Página editar_carreira.html
        carregarDadosParaEdicao(); // <-- Preenche o formulário
        document.getElementById('editar-form').addEventListener('submit', editarItem); // <-- Salva ao enviar
    }
});

// Função para lidar com o cadastro de um novo item
async function cadastrarItem(event) {
    event.preventDefault();

    const novoItem = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value,
        categoria: document.getElementById('categoria').value,
        periodo: document.getElementById('periodo').value,
        titulos: document.getElementById('titulos').value,
        gols: document.getElementById('gols').value,
        conteudo: document.getElementById('conteudo').value,
        destaque: false,
        momentos_iconicos: []
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoItem),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar item');
        }

        alert('Item cadastrado com sucesso!');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Falha no cadastro:', error);
        alert('Falha ao cadastrar o item. Verifique o console.');
    }
}

// Função para lidar com a exclusão de um item
async function excluirItem(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.");

    if (!confirmar) {
        return; 
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir item');
        }

        alert('Item excluído com sucesso!');
        location.reload();

    } catch (error) {
        console.error('Falha ao excluir:', error);
        alert('Falha ao excluir o item. Verifique o console.');
    }
}

// Função para PREENCHER o formulário de edição
async function carregarDadosParaEdicao() {
    // 1. Pegar o ID da URL (ex: ?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));

    if (!id) {
        alert('ID do item não fornecido!');
        window.location.href = 'index.html';
        return;
    }

    // 2. Buscar os dados desse item específico na API
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Item não encontrado');
        }
        const item = await response.json();

        // 3. Preencher cada campo do formulário com os dados do item
        document.getElementById('titulo').value = item.titulo;
        document.getElementById('descricao').value = item.descricao;
        document.getElementById('imagem').value = item.imagem;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('periodo').value = item.periodo;
        document.getElementById('titulos').value = item.titulos;
        document.getElementById('gols').value = item.gols;
        document.getElementById('conteudo').value = item.conteudo;

    } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
        alert('Erro ao carregar dados. Verifique se o item existe.');
    }
}

// Função para SALVAR as alterações (PUT)
async function editarItem(event) {
    event.preventDefault(); // Prevenir recarregamento da página

    // 1. Pegar o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));

    // 2. Coletar os dados ATUALIZADOS do formulário
    const itemAtualizado = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value,
        categoria: document.getElementById('categoria').value,
        periodo: document.getElementById('periodo').value,
        titulos: document.getElementById('titulos').value,
        gols: document.getElementById('gols').value,
        conteudo: document.getElementById('conteudo').value,
        // (Manter os dados que não estão no formulário, se necessário)
        // (Buscando o item original para não perder 'destaque' e 'momentos_iconicos')
        destaque: (await (await fetch(`${API_URL}/${id}`)).json()).destaque,
        momentos_iconicos: (await (await fetch(`${API_URL}/${id}`)).json()).momentos_iconicos
    };


    // 3. Enviar os dados para a API (método PUT)
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // PUT = Substituição completa do recurso
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemAtualizado),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar item');
        }

        // 4. Se deu certo, avisar e redirecionar
        alert('Item atualizado com sucesso!');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Falha na atualização:', error);
        alert('Falha ao atualizar o item. Verifique o console.');
    }
}