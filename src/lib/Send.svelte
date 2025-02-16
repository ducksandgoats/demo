<script>
  import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
//   import {link} from 'svelte-spa-router'
  import {dexie} from '../dir/data.js'
  
  let {func, tagProp, replyProp} = $props()
  let tags = $state('')
  let reply = $state('')
  let radio = $state('')
  let bt = $state('')
  let text = $state('')
  let elem = $state(null)
  function reset(e){
    console.log(e)
    elem.value = ''
  }
  async function send(e){
    e.preventDefault()
    const el = elem.files
    if(!el.length && !text){
      return
    }
    const formdata = new FormData()
    for(let i = 0;i < el.length;i++){
      if(el[i].size > 5000000){
        return
      }
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
    if(tagProp){
        tags = `${tagProp},${tags}`
    }
    if(replyProp){
        reply = `${replyProp},${reply}`
    }
    const test = await dexie.add('posts', {text, list: relay, for: reply ? reply.split(',').filter(Boolean) : null, tags: tags ? tags.split(',').filter(Boolean) : null})
    reply = ''
    tags = ''
    radio = ''
    bt = ''
    text = ''

    func(await dexie.db.table('posts').get(test))
  };
</script>

<Row>
    <Col>
        <Form on:submit={send}>
        <Row>
            <Input type="text" bind:value={reply} placeholder="post ids, optional, comma separated"></Input>
            <Input type="text" bind:value={tags} placeholder="tags, optional, comma separated"></Input>
        </Row>
        <Input type="file" name="file" bind:this={elem} multiple/>
        <Button type="button" on:click={reset}>Reset</Button>
        <!-- {#if elem.files.length} -->
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
        <Row>
            <Button type="submit">Submit</Button>
        </Row>
        </Form>
    </Col>
</Row>