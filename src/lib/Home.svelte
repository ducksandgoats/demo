<script>
  import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
  import {dexie} from '../dir/data.js'

  let pageNumber = 1
  let pageSize = 10
  let radio = ''
  let bt = ''
  let text = ''
  let arr = []

  async function down(e){
    console.log(e)
    if(pageNumber > 1){
      pageNumber = pageNumber - 1
    }
    arr = await dexie.table('posts')
    .reverse()
    .offset(pageNumber * pageSize)
    .limit(pageSize)
    .toArray()
  }

  async function up(e){
    console.log(e)
    pageNumber = pageNumber + 1
    arr = await dexie.table('posts')
    .reverse()
    .offset(pageNumber * pageSize)
    .limit(pageSize)
    .toArray()
  }

  async function send(e){
    e.preventDefault()
    const el = document.getElementById('file').files
    if(!el.length && !text){
      return
    }
    const formdata = new FormData()
    for(let i = 0;i < el.length;i++){
      formdata.append(el[i].name, el[i])
    }
    let protoc
    if(radio === 'bt:'){
      if(bt === 'update'){
        protoc = '_'
      } else if(bt === 'regular'){
        protoc = '.'
      } else {
        return
      }
    } else if(radio === 'ipfs:'){
      protoc = '.'
    } else if(radio === 'hyper:'){
      protoc = '_'
    } else {
      return
    }
    const relay = await (await fetch(`${radio}//${protoc}/`, {method: 'POST', body: formdata})).json()
    const test = await dexie.add('posts', {text, list: relay})
    arr.push(await dexie.db.table('posts').get(test))

    radio = ''
    bt = ''
    text = ''
    arr = arr
  };

  (async () => {arr = await dexie.table('posts').reverse().offset(pageNumber * pageSize).limit(pageSize).toArray();})().then(console.log).catch(console.error);
</script>

<Row>
  <Col>
    <Form on:submit={send}>
      <Input type="file" name="file" id="file"/>
      <!-- {#if document.getElementById('file').files.length} -->
        {#each ['bt:', 'ipfs:', 'hyper:'] as value}
          <Input type="radio" bind:group={radio} {value} label={value}/>
        {/each}
      <!-- {/if} -->
       {#if radio === 'bt:'}
        {#each ['update', 'regular'] as value}
          <Input type="radio" bind:group={bt} {value} label={value}/>
        {/each}
       {/if}
      <Input type="text" bind:value={text}></Input>
      <Button type="submit">Submit</Button>
    </Form>
  </Col>
</Row>

<Row>
  <Col>
    {#each arr as post}
      <Row>
        <Col>
          <p>{post.iden}</p>
          {#each post.list as link}
            {#if link.endsWith('.mp4')}
              <video src={link} controls><track kind="captions"></video>
            {:else if link.endsWith('.mp3')}
              <audio src={link} controls></audio>
            {:else if link.endsWith('.png')}
              <img src={link} alt={link}>
            {:else}
              <p>file not supported</p>
            {/if}
          {/each}
          <p>{post.text}</p>
        </Col>
      </Row>
    {/each}
  </Col>
</Row>

<Row>
  <Col>
  <Row>
    <Col>
      <Button type="button" on:click={down}>←</Button>{pageNumber}<Button type="button" on:click={up}>→</Button>
    </Col>
  </Row>
  <Row>
    <Col>
      <Input bind:value={pageSize} type="number" placeholder="size of results"></Input>
    </Col>
  </Row>
  </Col>
</Row>