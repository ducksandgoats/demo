<script>
  import {Row, Col, Input, Button, Form} from '@sveltestrap/sveltestrap'
  import {dexie} from '../dir/data.js'
  import Post from './Post.svelte'

  let {params} = $props()

  let post
  let e
  dexie.db.table('posts').get(params.post).then((data) => {post = data}).catch((err) => {e = err.message})
</script>

{#if post}
    <Post post={post}/>
{/if}

{#if e}
    <Row>
        <Col>
            <p>{e}</p>
        </Col>
    </Row>
{/if}