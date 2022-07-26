# GetMySecret API

> API Serverless da aplicação feita para a criação de informações que serão acessadas atráves de um link apenas uma vez!

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

  // caso a região onde você criou seu usuário seja diferente de sa-east-1, altere no arquivo serverless.yml ou faça o deploy com este comando, onde <region> é a região escolhida.
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

- **Para obter o segredo, acesse o endpoint `delete: /secret/{uuid}`**

  O resultado será seu segredo:
  ```
    {
      "content": "ocXarJ42aayOjAXa836rDIJyyY6Jry20kKvH",
	    "uuid": "fzE3ZqP83vFomnRNuX5mXK",
    	"expiration": 1659477428588
    }
  ```

  O frontend irá descriptografar o segredo e validará a senha. Isso porque ambos foram desenvolvidos com javascript.

- **Ao tentar a requisição acima novamente, verá que o segredo foi deletado.**

## Background Job

A função `destroyExpiredSecret` é executada a cada minuto e verificará se o prazo de 07 (sete) dias foi ultrapassado. Caso aconteça, o segredo será destruído.

## Tecnologias utilizadas

- [Serverless Framework](https://www.serverless.com/)
- [Dynamo DB](https://aws.amazon.com/pt/dynamodb/)
- [Node Js](https://nodejs.org/en/)
  - [Middy](https://middy.js.org/)
  - [http-errors](https://www.npmjs.com/package/http-errors)
  - [short-uuid](https://www.npmjs.com/package/short-uuid)
