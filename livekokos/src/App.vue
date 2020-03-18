<template>
  <div class="container">
    <div class="belka">
      <div class="logo">
        LiveKOKOS
      </div>
    </div>
        <div class="login">
          LOGIN
        </div>
        <div class="overlay-left">
           <form class="sign-in">
            <input class="text" type="text" placeholder="Name"/>
            <input type="password" placeholder="Password"/>
          </form>
          <button>Sign in</button>
        </div>
        <div class="or">
          OR
        </div>
        <div class="register">
          REGISTER
        </div>
        <div class="overlay-right">
          <form class="sign-up">
            <input type="text" placeholder="Name"/>
            <input type="email" placeholder="Email"/>
            <input type="password" placeholder="Password"/>
          </form>
          <button>Sign up</button>
        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .container{
    position: relative;
    width: 1920px;
    height: 1080px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #61BDFF;
    box-sizing: border-box;
    border-radius: 5px;

    .belka{
      position: absolute;
      width: 1920px;
      height: 98px;
      left: 0px;
      top: 0px;

      background: #37B7FF;

      .logo{
        position: absolute;
        width: 452px;
        height: 98px;
        left: 0px;
        

        font-family: Helvetica;
        font-style: normal;
        font-weight: normal;
        font-size: 72px;
        line-height: 98px;
        align-items: center;
        text-align: center;

        color: #FFFFFF;
      }
    }

    .login{
      position: absolute;
      width: 607px;
      height: 103px;
      left: 167px;
      top: 171px;

      font-family: Helvetica;
      font-style: normal;
      font-weight: normal;
      font-size: 72px;
      line-height: 84px;
      display: flex;
      align-items: center;

      color: #37B7FF;
    }

    .overlay-left{
      position: absolute;
      width: 620px;
      height: 556px;
      left: 167px;
      top: 274px;

      background: #FFFFFF;
      border: 2px solid #61BDFF;
      box-sizing: border-box;
      border-radius: 5px;
    }

    .or{
      position: absolute;
      width: 352px;
      height: 124px;
      left: 774px;
      top: 518px;

      font-family: Helvetica;
      font-style: normal;
      font-weight: normal;
      font-size: 72px;
      line-height: 84px;
     
      align-items: center;
      text-align: center;

      color: #37B7FF;
    }

    .register{
      position: absolute;
      width: 619px;
      height: 103px;
      left: 1126px;
      top: 171px;

      font-family: Helvetica;
      font-style: normal;
      font-weight: normal;
      font-size: 72px;
      line-height: 84px;
      display: flex;
      align-items: center;

      color: #37B7FF;
    }

    .overlay-right{
      position: absolute;
      width: 620px;
      height: 640px;
      left: 1126px;
      top: 274px;

      background: #FFFFFF;
      border: 2px solid #61BDFF;
      box-sizing: border-box;
      border-radius: 5px;
    }
  }

button{
  position: absolute;
  width: 240px;
  height: 70px;
  top: 75%;
  left: 190px;
  background: #C4C4C4;
  border-radius: 5px;

  font-family: helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 42px;
  align-items: center;
  text-align: center;

  color: #000000;
}

form{
  position: absolute;
  top: 124px;
  left: 45px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  input{
    width: 530px;
    height: 73px;
    bottom: 34px;
    background: #C4C4C4;
    border-radius: 5px;

    font-family: helvetica;
    font-style: normal;
    font-weight: normal;
    font-size: 36px;
    line-height: 42px;
    align-items: center;
    text-align: center;

    color: #A5A5A5;
 }
}
</style>
