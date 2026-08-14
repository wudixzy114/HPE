<template>
  <Slide class="db-slide">
    <div class="db-kicker">字段类型 · 字符串</div>
    <h2 data-node="title">
      “String”不是数据库类型；CHAR、VARCHAR、TEXT 的边界不同
    </h2>
    <table
      data-node="string-type-table"
      class="db-table dense"
      style="margin-top: 24px"
    >
      <thead>
        <tr>
          <th>类型</th>
          <th>特点</th>
          <th>典型场景</th>
          <th>常见误用</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>CHAR(n)</strong></td>
          <td>固定声明长度语义；不同数据库对尾部空格处理有差异</td>
          <td>真正固定长度的国家码、币种码；仍需查数据库行为</td>
          <td>以为固定长度一定更快，把普通名称都设成 CHAR</td>
        </tr>
        <tr>
          <td><strong>VARCHAR(n)</strong></td>
          <td>可变长度，并限制最大字符数或长度语义</td>
          <td>名称、编码、邮箱、手机号、业务编号</td>
          <td>所有字段机械写 255；或上限小到无法国际化</td>
        </tr>
        <tr>
          <td><strong>TEXT</strong></td>
          <td>适合长文本；具体存储与 VARCHAR 差异取决于数据库</td>
          <td>描述、错误堆栈、备注、日志正文</td>
          <td>在整列长文本上建立普通 B-tree 索引并做任意模糊搜索</td>
        </tr>
      </tbody>
    </table>
    <div data-node="length-method" class="db-grid-2" style="margin-top: 20px">
      <div class="db-card teal">
        <div class="db-label">长度怎么定</div>
        <ol>
          <li>先取协议或业务硬上限：ISO 币种 3 位、外部系统编码上限等。</li>
          <li>没有硬上限时看真实样本 P99，再为国际化与演进留余量。</li>
          <li>区分“产品输入限制”和“数据库保护上限”，二者不一定相同。</li>
          <li>编码字段要短且规范；长描述直接使用 TEXT。</li>
        </ol>
      </div>
      <div class="db-card orange">
        <div class="db-label">长度为什么有意义</div>
        <ul>
          <li><strong>过小：</strong>上线后截断、迁移、接口不兼容。</li>
          <li>
            <strong>过大：</strong
            >失去业务约束，索引键可能过宽，错误值难以及时发现。
          </li>
          <li>
            <strong>字符 ≠ 字节：</strong>UTF-8
            中文通常占多个字节；长度语义和索引上限要查数据库。
          </li>
          <li>
            <strong>唯一性：</strong>大小写、首尾空格、排序规则会影响 Alice 与
            alice 是否相同。
          </li>
        </ul>
      </div>
    </div>
    <div class="db-band">
      <strong>实用默认：</strong>短编码 32/64、普通名称 128
      只是起点；最终长度必须由业务上限、样本和目标数据库共同确认。
    </div>
    <div class="db-footer">
      <span>不要迷信 255，也不要为了“省空间”随意截短</span><span>04</span>
    </div>
  </Slide>
</template>

<notes lang="md">
回答“可变 char 和 string 有什么区别”：String 是编程语言或接口概念，落到数据库要选择 CHAR/VARCHAR/TEXT。强调 VARCHAR(n) 的 n 在不同数据库中可能涉及字符或长度语义，UTF-8 字节数与字符数不同。255 没有普遍业务意义。
</notes>
