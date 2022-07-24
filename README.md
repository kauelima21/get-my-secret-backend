# GetMySecret API

> API Serverless para a criação de informações para serem acessadas em um link apenas uma vez!

## Como colocar para funcionar?

O projeto foi criado utilizando serverless framework com template node-aws, portanto é necessário seguir os seguintes requisitos:

- [AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-install.html) instalado e configurado com um usuário IAM.
- [serverless framework](https://www.serverless.com/framework/docs/getting-started) (recomendo a instalação global).

Faça o clone do repositório e depois siga estes passos:

entre na pasta do projeto, abra um terminal e instale os pacotes necessários
```
  cd get-my-secret-backend/

  yarn
```
 caso utilize npm o comando é:
```
  npm i
```

faça o deploy
```
  serverless deploy

  // ou a versão mais curta
  sls deploy

  // caso a região onde você criou seu usuário seja diferente de us-east-1, altere no arquivo serverless.yml ou faça o deploy com este comando, onde <region> é a região escolhida.
  sls deploy --region <region>
```

Aguarde enquanto o projeto é enviado para a aws. Não precisa configurar o API Gateway, o serverless framework cuida disso para você ; )

Quando terminar você receberá as duas rotas no output do seu terminal.

Caso queira rodar o projeto localmente, você pode utilizar os plugins [serverless-offline](https://www.serverless.com/plugins/serverless-offline) e [serverless-dynamodb-local](https://www.serverless.com/plugins/serverless-dynamodb-local). O comando `sls offline` ativa os dois, mas é sempre bom verificar a documentação antes.

## Como funciona?

![API Serverless Bootcamp](/images/api_bootcamp.png)

O client / frontend faz requisições para um endpoint gerenciado pelo API Gateway que dispara lambda functions para determinada ação. A seguir, listam-se os endpoints e seus serviços:

- **Criar um segredo através do endpoint `post: /secret`**

  No corpo da requisição, utilize algo semelhante ao seguinte modelo:
  ```
    {
      "content": "Meu segredo secreto",
      "password": "MinhaSenhaSecreta123"  // este parâmetro é opcional.
    }
  ```

  Sua resposta será algo como:
  ```
    {
      "secretUUID": "9oKgc8oGXbD99i2mLQLrmF",
      "encryptionKey": "4hoU1GPDpDe4aE41nrxH1u"
    }
  ```
  Caso siga o exemplo acima, atente-se ao fato de que o hash não será o mesmo.

- **Para obter o segredo, acesse o endpoint `patch: /secret/{uuid}/{encryptionKey}`**

  Caso tenha criado um segredo com senha, informe a mesma como parâmetro no corpo da requisição:
  ```
    {
      "password": "MinhaSenhaSecreta123"
    }
  ```
  O resultado será seu segredo:
  ```
    "Meu segredo secreto"
  ```

  Atente-se ao fato de que enviar a requisição sem corpo retornará erro apenas no caso de uma segredo cadastrado com senha.

- **Ao tentar a requisição acima novamente, verá que o segredo foi deletado.**

- **Deletar um segredo através do endpoint `delete: /secret/{uuid}`**

  Caso o segredo possua uma senha, o frontend já terá validado, visto que o referido endpoint só é acessado no momento em que o usuário receptor já validou a senha e já a visualizou.

- **Verificar se possui senha através do endpoint `get: /secret/{uuid}`**

  O retorno pode ser um 404 ou uma mensagem de sucesso. Rota usada para o frontend validar a existência de uma senha para o segredo.

## Background Job

A função `destroyExpiredSecret` é executada acada minuto e verificará se o prazo de 07 (sete) dias foi ultrapassado. Caso aconteça, o segredo será destruído.

## Tecnologias utilizadas

- [Serverless Framework](https://www.serverless.com/)
- [Dynamo DB](https://aws.amazon.com/pt/dynamodb/)
- [Node Js](https://nodejs.org/en/)
  - [Middy](https://middy.js.org/)
  - [http-errors](https://www.npmjs.com/package/http-errors)
  - [short-uuid](https://www.npmjs.com/package/short-uuid)
