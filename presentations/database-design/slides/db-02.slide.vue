<script setup lang="ts">
import { useSlideState } from "@hpe/renderer-vue/slide-state";

type TypeKind =
  "integer" | "decimal" | "string" | "datetime" | "boolean" | "json";

const typeKind = useSlideState<TypeKind>("type-kind", {
  slideId: "db-02",
  initial: "integer",
  inspect: ["integer", "decimal", "string", "datetime", "boolean", "json"],
});
</script>

<template>
  <Slide class="db-slide">
    <div class="db-kicker">MySQL 类型全景 · 点击查看详情</div>
    <h2 data-node="title">点击一种类型，查看底层表示、适用字段和常见问题</h2>
    <div data-node="type-tabs" class="db-type-tabs" style="margin-top: 21px">
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'integer' }"
        @click="typeKind = 'integer'"
      >
        <strong>整数</strong><span>TINYINT / INT / BIGINT</span>
      </button>
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'decimal' }"
        @click="typeKind = 'decimal'"
      >
        <strong>小数</strong><span>DECIMAL / FLOAT / DOUBLE</span>
      </button>
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'string' }"
        @click="typeKind = 'string'"
      >
        <strong>字符串</strong><span>CHAR / VARCHAR / TEXT</span>
      </button>
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'datetime' }"
        @click="typeKind = 'datetime'"
      >
        <strong>日期时间</strong><span>DATE / DATETIME / TIMESTAMP</span>
      </button>
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'boolean' }"
        @click="typeKind = 'boolean'"
      >
        <strong>真假与状态</strong><span>BOOLEAN / 状态代码</span>
      </button>
      <button
        class="db-type-tab"
        :class="{ active: typeKind === 'json' }"
        @click="typeKind = 'json'"
      >
        <strong>结构化扩展</strong><span>JSON / BLOB</span>
      </button>
    </div>

    <div data-node="type-detail" class="db-type-detail">
      <div v-if="typeKind === 'integer'" class="db-type-detail-grid">
        <div>
          <h3>整数使用固定字节保存二进制数值</h3>
          <table class="db-table compact" style="margin-top: 13px">
            <thead>
              <tr>
                <th>类型</th>
                <th>常见存储</th>
                <th>有符号范围</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TINYINT</td>
                <td>1 字节</td>
                <td>-128～127</td>
              </tr>
              <tr>
                <td>SMALLINT</td>
                <td>2 字节</td>
                <td>-32,768～32,767</td>
              </tr>
              <tr>
                <td>INT</td>
                <td>4 字节</td>
                <td>约 ±21 亿</td>
              </tr>
              <tr>
                <td>BIGINT</td>
                <td>8 字节</td>
                <td>约 ±9.22×10¹⁸</td>
              </tr>
            </tbody>
          </table>
          <div class="db-note" style="margin-top: 13px">
            MySQL 可使用 UNSIGNED
            把负数范围换成更大的正数范围。主键一旦被大量外键引用，后期扩容成本很高。
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">ID</span
              ><span><b>BIGINT：</b>普通内部主键、长期增长的流水号。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge blue">N</span
              ><span><b>INT：</b>数量、次数、页码、有限范围计数。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge orange">小</span
              ><span
                ><b>SMALLINT/TINYINT：</b>优先级、小序号、非常有限的数值。</span
              >
            </div>
          </div>
          <div class="db-band red" style="margin-top: 15px">
            <strong>不适合：</strong
            >手机号、邮编、业务编号。这些值只用于识别，不参与算术。
          </div>
        </div>
      </div>

      <div v-else-if="typeKind === 'decimal'" class="db-type-detail-grid">
        <div>
          <h3>精确十进制与近似浮点采用不同表示</h3>
          <table class="db-table compact" style="margin-top: 13px">
            <thead>
              <tr>
                <th>类型</th>
                <th>底层特点</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DECIMAL(p,s)</td>
                <td>按十进制数字保存精度与小数位</td>
                <td>适合精确比较和计算</td>
              </tr>
              <tr>
                <td>FLOAT</td>
                <td>常见 4 字节 IEEE 754</td>
                <td>范围大，精度有限</td>
              </tr>
              <tr>
                <td>DOUBLE</td>
                <td>常见 8 字节 IEEE 754</td>
                <td>比 FLOAT 精度高，仍是近似值</td>
              </tr>
            </tbody>
          </table>
          <div class="db-code" style="margin-top: 13px">
            unit_price DECIMAL(18, 6)
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">准</span
              ><span
                ><b>DECIMAL：</b>费用、精确比例、需要严格相等的十进制值。</span
              >
            </div>
            <div class="db-rule">
              <span class="db-badge blue">测</span
              ><span
                ><b>FLOAT/DOUBLE：</b
                >监控指标、测量数据、允许小误差的统计。</span
              >
            </div>
          </div>
          <div class="db-band" style="margin-top: 15px">
            <strong>PRD 需要给出：</strong>单位、最大范围、小数位和取舍精度。
          </div>
        </div>
      </div>

      <div v-else-if="typeKind === 'string'" class="db-type-detail-grid">
        <div>
          <h3>字符串按字符集编码成字节</h3>
          <table class="db-table compact" style="margin-top: 13px">
            <thead>
              <tr>
                <th>类型</th>
                <th>存储与语义</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CHAR(n)</td>
                <td>声明固定长度，尾部空格处理具有数据库语义</td>
              </tr>
              <tr>
                <td>VARCHAR(n)</td>
                <td>保存实际内容，并额外记录长度；n 限制最大长度</td>
              </tr>
              <tr>
                <td>TEXT</td>
                <td>用于长文本；具体行内/行外存储取决于行格式与长度</td>
              </tr>
            </tbody>
          </table>
          <div class="db-note" style="margin-top: 13px">
            UTF-8
            中一个中文字符通常占多个字节。排序规则还会决定大小写和重音字符是否被视为相同。
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">短</span
              ><span><b>VARCHAR：</b>名称、手机号、编码、业务编号。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge blue">长</span
              ><span><b>TEXT：</b>描述、错误详情、备注、日志正文。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge orange">定</span
              ><span
                ><b>CHAR：</b>真正固定长度的短代码，使用前确认空格语义。</span
              >
            </div>
          </div>
          <div class="db-band" style="margin-top: 15px">
            <strong>长度选择：</strong
            >协议硬上限优先；否则依据真实样本和未来余量，不机械使用 255。
          </div>
        </div>
      </div>

      <div v-else-if="typeKind === 'datetime'" class="db-type-detail-grid">
        <div>
          <h3>时间类型保存可比较、可计算的日期与时刻</h3>
          <table class="db-table compact" style="margin-top: 13px">
            <thead>
              <tr>
                <th>类型</th>
                <th>MySQL 常见语义</th>
                <th>典型存储</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DATE</td>
                <td>只有年月日</td>
                <td>3 字节</td>
              </tr>
              <tr>
                <td>DATETIME</td>
                <td>日期和时间，不自动表达地区时区</td>
                <td>5 字节起</td>
              </tr>
              <tr>
                <td>TIMESTAMP</td>
                <td>会按连接时区转换显示，范围有限</td>
                <td>4 字节起</td>
              </tr>
            </tbody>
          </table>
          <div class="db-note" style="margin-top: 13px">
            带小数秒时还会增加存储。具体范围、时区和默认行为应按目标 MySQL
            版本确认。
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">日</span
              ><span><b>DATE：</b>业务日期、统计日、有效日期。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge blue">时</span
              ><span><b>DATETIME：</b>创建、开始、结束等业务时刻。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge orange">空</span
              ><span><b>NULL：</b>started_at 为空可以明确表示“尚未开始”。</span>
            </div>
          </div>
          <div class="db-band red" style="margin-top: 15px">
            <strong>避免：</strong>使用 “昨天”“2026/8/1” 等自由字符串保存时间。
          </div>
        </div>
      </div>

      <div v-else-if="typeKind === 'boolean'" class="db-type-detail-grid">
        <div>
          <h3>MySQL BOOLEAN 通常是 TINYINT(1) 的别名</h3>
          <div class="db-code" style="margin-top: 13px">
            is_enabled BOOLEAN NOT NULL<br />DEFAULT FALSE<br /><br />status
            VARCHAR(20) NOT NULL<br />CHECK (status IN (<br />
            'QUEUED','RUNNING','SUCCEEDED',<br />
            'FAILED','CANCELLED'<br />))
          </div>
          <div class="db-note" style="margin-top: 13px">
            BOOLEAN 的业务含义仍应限制为 0/1；任务状态则保存一个有限的机器代码。
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">Y/N</span
              ><span><b>BOOLEAN：</b>是否启用、是否公开等两个明确答案。</span>
            </div>
            <div class="db-rule">
              <span class="db-badge blue">状态</span
              ><span
                ><b>VARCHAR + CHECK：</b
                >排队、运行、成功、失败等多个阶段。</span
              >
            </div>
            <div class="db-rule">
              <span class="db-badge orange">历史</span
              ><span>需要解释过程时，增加状态事件表保存每次变化。</span>
            </div>
          </div>
          <div class="db-band" style="margin-top: 15px">
            <strong>区别：</strong>状态列的物理类型仍是
            VARCHAR；有限取值和迁移规则赋予它业务含义。
          </div>
        </div>
      </div>

      <div v-else class="db-type-detail-grid">
        <div>
          <h3>JSON 使用 MySQL 原生二进制格式保存结构</h3>
          <table class="db-table compact" style="margin-top: 13px">
            <thead>
              <tr>
                <th>类型</th>
                <th>底层特点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JSON</td>
                <td>
                  写入时校验合法 JSON，并以内部二进制格式保存，支持按路径读取
                </td>
              </tr>
              <tr>
                <td>BLOB</td>
                <td>保存原始字节，不理解其中结构</td>
              </tr>
            </tbody>
          </table>
          <div class="db-code" style="margin-top: 13px">
            config JSON NOT NULL<br /><br />{"timeout":30,"rules":["NOT_NULL"]}
          </div>
        </div>
        <div>
          <h3>使用场景</h3>
          <div class="db-rule-list" style="margin-top: 13px">
            <div class="db-rule">
              <span class="db-badge">JSON</span
              ><span
                ><b>模板特有配置：</b>结构随模板版本变化，通常整份读取。</span
              >
            </div>
            <div class="db-rule">
              <span class="db-badge blue">列</span
              ><span
                ><b>普通列：</b
                >项目、状态、提交人等需要外键、筛选和约束的字段。</span
              >
            </div>
            <div class="db-rule">
              <span class="db-badge orange">文件</span
              ><span
                ><b>BLOB/对象存储：</b
                >大文件通常放对象存储，数据库保存地址和元数据。</span
              >
            </div>
          </div>
          <div class="db-band red" style="margin-top: 15px">
            <strong>避免：</strong>把整条业务记录都塞进一个
            JSON，导致关系和关键规则无法约束。
          </div>
        </div>
      </div>
    </div>
    <div class="db-footer">
      <span>点击上方六类切换；所有交互状态均可在演示检查中复现</span
      ><span>02</span>
    </div>
  </Slide>
</template>

<notes lang="md">
现场点击六个类型分类。每次先讲底层表示，再讲适用字段和常见错误。这里的字节数和行为以 MySQL 8.4 常见实现为参考，具体项目仍应查看实际版本、字符集和存储引擎配置。
</notes>
