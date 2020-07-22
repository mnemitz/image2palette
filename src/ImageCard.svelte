<script>
import Card, { Content, Media, MediaContent, PrimaryAction } from '@smui/card';

export let src;

</script>
<style>
#card-container {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
</style>
<div id="card-container">
    <Card style="width: 100%;">
        <PrimaryAction>
            <Media style={`background-image: url(${src});`} class="card-media-16x9" aspectRatio="16x9"/>
            <Content class="mdc-typography--body2">
                <slot></slot>
            </Content>
        </PrimaryAction>
    </Card>
</div>