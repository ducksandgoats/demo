<script>
  import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
  import { route } from "@mateothegreat/svelte5-router";
  // import {link} from 'svelte-spa-router'
  import {dexie} from '../dir/data.js'
  import Send from './Send.svelte'
  import Self from './Post.svelte'

  let {post} = $props()
  let replies = $state([])
  let showReply = $state(false)
  let showTo = $state(false)
  let showFrom = $state(false)
  let replyTo = $state([])
  let replyFrom = $state([])
  function handleReply(e){
    replies.push(e)
    replies = replies
  }
  function replyToFunc(e){
    console.log(e)
    showTo = !showTo
    if(showTo){
        if(!replyTo.length){
            dexie.db.table('posts').where('id').anyOf(post.for).then((data) => {return data.toArray()}).then((data) => {replyTo = data}).catch((err) => {console.error(err);showTo = false;})
        }
    }
  }
  function replyFromFunc(e){
    console.log(e)
    showFrom = !showFrom
    if(showFrom){
        if(!replyFrom.length){
            dexie.db.table('posts').where('for').equals(post.id).then((data) => {return data.toArray()}).then((data) => {replyFrom = data}).catch((err) => {console.error(err);showFrom = false;})
        }
    }
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
</script>

<Row>
    <Col>
        {#if post.for}
        {#if showTo}
        {#if replyTo.length}
        {#each replyTo as post}
        <Self post={post}/>
        {/each}
        {/if}
        {/if}
        <Button on:click={replyToFunc}>Show Reply To</Button>
        {/if}
      <p><a href={'/users/' + post.user} use:route>{post.user}</a></p>
      <p><a href={'/posts/' + post.iden} use:route>{post.iden}</a></p>
      {#if post.tags}
        <p>
          {#each post.tags as tag}
            <span>|<a href={'/tags/' + tag} use:route>{tag}</a>|</span>
          {/each}
        </p>
      {/if}
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
      <Button on:click={() => {showReply = !showReply}}>Reply</Button>
      {#if showReply}
      <Send func={handleReply} replyProp={null} tagProp={null}/>
      {/if}
      {#if replies.length}
      {#each replies as post}
      <Self post={post}/>
      {/each}
      {/if}
      {#if showFrom}
      {#if replyFrom.length}
      {#each replyFrom as post}
      <Self post={post}/>
      {/each}
      {/if}
      {/if}
      <Button on:click={replyFromFunc}>Show Reply To</Button>
    </Col>
  </Row>