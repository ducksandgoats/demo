<script>
    import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
    // import {location} from 'svelte-spa-router'
    import {dexie} from '../dir/data.js'
    import Post from './Post.svelte'
    import Send from './Send.svelte'

    let {params} = $props()

    let pageNumber = $state(0)
    let pageSize = $state(10)
    let count = $state(0)
    let posts = $state([])
    let arr = $state([])
  
    async function down(e){
      console.log(e)
      if(pageNumber > 0){
        pageNumber = pageNumber - 1
      }
      arr = await dexie.table('posts').where('tags').equals(params.tag)
      .reverse()
      .offset(pageNumber * pageSize)
      .limit(pageSize)
      .toArray()
    }
  
    async function up(e){
      console.log(e)
      pageNumber = pageNumber + 1
      arr = await dexie.table('posts').where('tags').equals(params.tag)
      .reverse()
      .offset(pageNumber * pageSize)
      .limit(pageSize)
      .toArray()
    }
  
    function handleSend(sent){
      posts.push(sent)
      posts = posts
    }
  
    (async () => {count = await dexie.table('posts').count();console.log(count);arr = await dexie.table('posts').reverse().offset(pageNumber * pageSize).limit(pageSize).toArray();})().then(console.log).catch(console.error);
  </script>
  
  <Row>
    <Col>
      <Send func={handleSend} replyProp={null} tagProp={null}/>
    </Col>
  </Row>
  
  <Row>
    <Col>
      {#each posts as post}
      <Post post={post}/>
      {/each}
    </Col>
  </Row>
  
  <Row>
    <Col>
      {#each arr as post}
      <Post post={post}/>
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