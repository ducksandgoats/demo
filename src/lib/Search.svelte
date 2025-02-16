<script>
    import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
    import {dexie} from '../dir/data.js'
    import Post from './Post.svelte'
    // import Send from './Send.svelte'
  
    let str = $state('')
    let pageNumber = $state(0)
    let pageSize = $state(10)
    let count = $state(0)
    let arr = $state([])

    async function search(){
        const useTable = dexie.db.table('posts')
        const prefixes = str.split(' ').filter(Boolean)
        const result = new Set((await Promise.all(prefixes.map((data) => {return useTable.reverse().filter((datas) => {return datas.text.includes(data)}).offset(pageNumber * pageSize).limit(pageSize).primaryKeys()}))).flat())
        return await useTable.where('id').anyOf(Array.from(result)).toArray()
    }
  
    async function down(e){
      console.log(e)
      if(pageNumber > 0){
        pageNumber = pageNumber - 1
      }
      arr = await search()
    }
  
    async function up(e){
      console.log(e)
      pageNumber = pageNumber + 1
      arr = await search()
    }
  </script>
  
  <Row>
    <Col>
        <Form on:submit={(e) => {e.preventDefault();pageNumber = 1;search().then(console.log).catch(console.error);}}>
            <Input type="text" bind:value={str} placeholder="search term"></Input>
        </Form>
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