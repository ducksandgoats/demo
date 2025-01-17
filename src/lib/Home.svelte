<script>
  import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
  import {dexie} from '../dir/data.js'

  let pageNumber = 0
  let pageSize = 10
  let radio = ''
  let bt = ''
  let text = ''
  let count = 0
  let arr = []

  function reset(e){
    console.log(e)
    document.getElementById('file').value = ''
  }

  function vid(data){
    return data === '.mp4' || data === '.webm' || data === '.mov'
  }

  function aud(data){
    return data === '.mp3' || data === '.wav' || data === '.aac'
  }

  function pic(data){
    return data === '.png' || data === '.jpeg' || data === '.jpg' || data === '.webp' || data === '.gif'
  }

  async function down(e){
    console.log(e)
    if(pageNumber > 0){
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
      if(bt === 'updatable torrent'){
        protoc = '_'
      } else if(bt === 'regular torrent'){
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
    const relay = await (await fetch(`${radio}//${protoc}/`, {method: 'POST', body: formdata, headers: {'Accept': 'application/json'}})).json()
    const test = await dexie.add('posts', {text, list: relay})
    arr.push(await dexie.db.table('posts').get(test))

    radio = ''
    bt = ''
    text = ''
    document.getElementById('file').value = ''
    arr = arr
  };

  (async () => {count = await dexie.table('posts').count();console.log(count);arr = await dexie.table('posts').reverse().offset(pageNumber * pageSize).limit(pageSize).toArray();})().then(console.log).catch(console.error);
</script>

<Row>
  <Col>
    <Form on:submit={send}>
      <Input type="file" name="file" id="file"/>
      <Button type="button" on:click={reset}>Reset</Button>
      <!-- {#if document.getElementById('file').files.length} -->
        {#each ['bt:', 'ipfs:', 'hyper:'] as value}
          <Input type="radio" bind:group={radio} {value} label={value}/>
        {/each}
      <!-- {/if} -->
       {#if radio === 'bt:'}
        {#each ['updatable torrent', 'regular torrent'] as value}
          <Input type="radio" bind:group={bt} {value} label={value}/>
        {/each}
       {/if}
      <Input type="text" bind:value={text} placeholder="some text for the post"></Input>
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
            {#if vid(link.slice(link.lastIndexOf('.')))}
              <video src={link} controls><track kind="captions"></video>
            {:else if aud(link.slice(link.lastIndexOf('.')))}
              <audio src={link} controls></audio>
            {:else if pic(link.slice(link.lastIndexOf('.')))}
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
      <p>go through posts</p>
      {#if pageNumber > 0}
        <Button type="button" on:click={down}>←</Button>
      {/if}
      {pageNumber}
      {#if (count - (pageNumber * pageSize)) > 0}
        <Button type="button" on:click={up}>→</Button>
      {/if}
    </Col>
  </Row>
  <Row>
    <Col>
      <p>size of results</p>
      <Input bind:value={pageSize} type="number"></Input>
    </Col>
  </Row>
  </Col>
</Row>